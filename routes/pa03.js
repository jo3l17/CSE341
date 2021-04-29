//pa03 PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.render('pages/pa03', { 
        title: 'Team Activity 03', 
        path: '/pa03', // For pug, EJS 
        activepa03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

module.exports = router;