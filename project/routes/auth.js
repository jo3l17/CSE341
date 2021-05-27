const express = require('express');
const { check, body } = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        body('password')
            .custom((value, { req }) => {
                var pattern = /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
                if (!value.match(pattern)) {
                    throw new Error('Password must be 8 characters long, and numbers and letters, at least 1 uppercase letter, and one special character')
                }
                return true;
            })
            .trim(),
        check('email', 'Please enter a valid email.')
            .isEmail()
            .normalizeEmail()
    ],
    authController.postLogin);

router.post('/signup',
    [
        check('email', 'Please enter a valid email.')
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email already exists');
                        }
                    })
            })
            .normalizeEmail(),
        body('password')
            .custom((value, { req }) => {
                var pattern = /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
                if (!value.match(pattern)) {
                    throw new Error('Password must be 8 characters long, and numbers and letters, at least 1 uppercase letter, and one special character')
                }
                return true;
            })
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords doesn't match")
                }
                return true
            })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset',
    check('email', 'Please enter a valid email.')
        .isEmail()
        .normalizeEmail(),
    authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password',
    body('password')
        .custom((value, { req }) => {
            var pattern = /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
            if (!value.match(pattern)) {
                throw new Error('Password must be 8 characters long, and numbers and letters, at least 1 uppercase letter, and one special character')
            }
            return true;
        })
        .trim(),
    authController.postNewPassword);

module.exports = router;