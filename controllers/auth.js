const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('project/auth/login', {
        editing: false,
        title: 'Login',
        path: '/login',
    });
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/project/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/project');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/project/login')
                })
                .catch(err => {
                    console.log(err);
                    req.flash('error', 'There was an error, check log');
                    res.redirect('/project/login');
                })
        }).catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
    res.render('project/auth/signup', {
        editing: false,
        title: 'Signup',
        path: '/signup',
        isAuthenticated: false
    });
}

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('project/auth/signup', {
            editing: false,
            title: 'Signup',
            path: '/signup',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg
        });
    }
    User.findOne({ email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exists');
                return res.redirect('/project/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/project/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'joelvaldezangeles@gmail.com',
                        subject: 'Signup Succeded',
                        html: '<h1>You successfully signed up!</h1>' +
                            '<p>go to <a href="https://cse341-prove.herokuapp.com/project/login">login</a> to access the page'
                    })
                });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/project');
    })
}

exports.getReset = (req, res, next) => {
    res.render('project/auth/reset', {
        editing: false,
        title: 'Reset',
        path: '/reset',
    });
}

exports.postReset = (req, res, next) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/project/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/project/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/project');
                console.log(token);
                return transporter.sendMail({
                    to: email,
                    from: 'joelvaldezangeles@gmail.com',
                    subject: 'Signup Succeded',
                    html: `<h1>You successfully signed up!</h1><hr>
                        <p>You requested a password reset</p>
                        <p>go to <a href="http://localhost:5000/project/reset/${token}">reset</a> to reset your password`
                })
            }).then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render('project/auth/new-password', {
                editing: false,
                title: 'New Password',
                path: '/new-password',
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    const { password, userId, passwordToken } = req.body;
    const newPassword = password;
    let resetUser;
    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            if (user) {
                resetUser = user;
                return bcrypt.hash(newPassword, 12);
            }
            req.flash('error', 'No User found');
            return res.redirect('/project/reset/' + passwordToken);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/project/login');
        })
        .catch(err => {
            console.log(err);
        });
}
