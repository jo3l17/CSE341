//pa02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself! 
const express = require('express');
const router = express.Router();
const books = [];

router.get('/', (req, res, next) => {
    res.render('pages/pa02', {
        title: 'Prove Asssignment 02',
        path: '/pa02', // For pug, EJS 
        activepa03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

router.get('/books', (req, res, next) => {
    res.render('pages/pa02books', {
        title: 'Books',
        books,
        path: '/pa02/books', // For pug, EJS 
        activepa03: true, // For HBS
        contentCSS: true, // For HBS
    });
});

router.post('/addBook', (req, res, next) => {
    let book = req.body;
    books.push(book);
    res.redirect('/pa02/books');
});

module.exports = router;