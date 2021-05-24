const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

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