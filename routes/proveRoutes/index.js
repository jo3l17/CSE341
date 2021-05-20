proveRoutes = require('express').Router();

// Route setup. You can implement more in the future!
const pa01Routes = require('./pa01');
const pa02Routes = require('./pa02');
const pa03Routes = require('./pa03'); 
const pa04Routes = require('./pa04'); 

proveRoutes
    .use('/pa01', pa01Routes)
    .use('/pa02', pa02Routes)
    .use('/pa03', pa03Routes)
    .use('/pa04', pa04Routes)
    .get('/', (req, res, next) => {
        // This is the primary index, always handled last. 
        res.render('pages/index', { title: 'Welcome to my CSE341 repo for Prove Assignments', path: '/' });
    })
    .use((req, res, next) => {
        // 404 page
        res.render('pages/404', { title: '404 - Page Not Found', path: req.url })
    })

module.exports = proveRoutes;