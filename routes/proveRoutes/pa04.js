//pa04 PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.render('pages/pa04', { 
        title: 'Team Activity 04', 
        path: '/pa04', // For pug, EJS 
        activepa04: true, // For HBS
        contentCSS: true, // For HBS
    });
});

module.exports = router;