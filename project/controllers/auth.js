const User = require('../models/user');
const Product = require('../models/products');
const Order = require('../models/order');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const dotenv = require('dotenv');
dotenv.config();
const errorHandler = require('../middleware/errorHandling');

const renderLogin = (res, errorMessage = '', oldInput = {}, validationErrors = []) => {
    return res.status(422).render('auth/login', {
        title: 'Login',
        path: '/login',
        errorMessage,
        oldInput,
        validationErrors,
    });
}

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.nodeMailerApikey
    }
}));

exports.getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/project');
    }
    renderLogin(res);
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/login', {
            title: 'Login',
            path: '/login',
            errorMessage: errors.array()[0].msg,
            oldInput: req.body,
            validationErrors: errors.array()
        });
    }
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return renderLogin(res, 'Invalid email or password.', req.body)
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true
                        req.session.isSeller = user.seller ? true : false
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/project');
                        });
                    }
                    return renderLogin(res, 'Invalid email or password.', req.body)
                })
                .catch(err => {
                    console.log(err);
                    return renderLogin(res, 'There was an error, check log.', req.body)
                })
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        editing: false,
        title: 'Signup',
        path: '/signup',
        isAuthenticated: false,
        oldInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: []
    });
}

exports.postSignup = (req, res, next) => {
    const { email, password, isSeller } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            editing: false,
            title: 'Signup',
            path: '/signup',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: req.body,
            validationErrors: errors.array()
        });
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] },
                seller: isSeller
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
                    isSeller?'<p>Welcome Seller</p>':''+
                    '<p>go to <a href="https://cse341-prove.herokuapp.com/project/login">login</a> to access the page'
            })
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        return res.redirect('/project');
    })
}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        title: 'Reset',
        path: '/reset',
        oldInput: {
            email: "",
        },
        validationErrors: []
    });
}

exports.postReset = (req, res, next) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render('auth/reset', {
            title: 'Reset',
            path: '/reset',
            oldInput: req.body,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
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
                    subject: 'Password reset',
                    html: `<h1>Password reset</h1><hr>
                        <p>You requested a password reset</p>
                        <p>go to <a href="https://cse341-prove.herokuapp.com/project/reset/${token}">reset</a> to reset your password`
                })
            }).then(result => {
                console.log(result)
            })
            .catch(err => errorHandler.showError(err, next));
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/new-password', {
                title: 'New Password',
                path: '/new-password',
                userId: user._id.toString(),
                passwordToken: token,
                oldInput: {
                    password: "",
                },
                validationErrors: []
            });
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.postNewPassword = (req, res, next) => {
    const { password, userId, passwordToken } = req.body;
    const newPassword = password;
    let resetUser;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render('auth/new-password', {
            title: 'New Password',
            path: '/new-password',
            userId: user._id.toString(),
            passwordToken: token,
            oldInput: req.body,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
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
        .catch(err => errorHandler.showError(err, next));
}


exports.changePassword = (req, res, next) => {
    const { password, newPassword, count, ordersCount } = req.body;
    let resetUser;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.render('auth/account', {
            title: req.user.email + ' | Account Details',
            path: '/account',
            user: req.session.user,
            productCount: count,
            ordersCount,
            oldInput: req.body,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    User.findOne({
        _id: req.session.user._id
    })
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        resetUser = user;
                        return bcrypt.hash(newPassword, 12);
                    }
                    return res.render('auth/account', {
                        title: req.user.email + ' | Account Details',
                        path: '/account',
                        user: req.user,
                        productCount: count,
                        ordersCount,
                        oldInput: req.body,
                        errorMessage: 'Invalid password, try logout and reset',
                        validationErrors: []
                    });
                })
                .then(hashedPassword => {
                    resetUser.password = hashedPassword;
                    return resetUser.save();
                })
                .then(result => {
                    req.session.user = req.user;
                    res.redirect('/project/account');
                })
                .catch(err => {
                    console.log(err);
                    return res.render('auth/account', {
                        title: req.user.email + ' | Account Details',
                        path: '/account',
                        user: req.user,
                        productCount: count,
                        ordersCount,
                        oldInput: req.body,
                        errorMessage: 'There was an error, check log',
                        validationErrors: []
                    });
                })
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.getAccount = (req, res, next) => {
    User.findOne({_id:req.session.user._id})
        .then(user => {
            Product.find({ userId: user })
                .count((err, count) => {
                    Order.find({ 'user.email': user.email })
                        .count((err, ordersCount) => {
                            if (err) {
                                return errorHandler.showError(err, next)
                            }
                            res.render('auth/account', {
                                title: user.email + ' | Account Details',
                                path: '/account',
                                user: user,
                                productCount: count,
                                ordersCount,
                                oldInput: {
                                    password: "",
                                    newPassword: "",
                                    confirmPassword: ""
                                },
                                validationErrors: []
                            });
                        })
                })
        })
        .catch(err => errorHandler.showError(err, next));
}