const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req
    // .get('Cookie')
    // .split(';')[0]
    // .trim().split('=')[1] == 'true';
    res.render('project/auth/login', {
        editing: false,
        title: 'Login',
        path: '/login',
    });
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
                    res.redirect('/project/login')
                });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.redirect('/poject/login');
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
                    res.redirect('/project/login')
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/project/login');
                })
        }).catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/project');
    })
}