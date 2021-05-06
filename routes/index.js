const routes = require('express').Router();
const proveAssignments = require('./proveRoutes');
const projectRoutes = require('./project');

routes
    .use('/proveAssignments', proveAssignments)
    .use('/project',projectRoutes)
    .get('/', (req, res, next) => {
        // This is the primary index, always handled last. 
        res.render('pages/index', { title: 'Welcome to my CSE341 repo for Prove Assignments', path: '/' });
    })
    .use((req, res, next) => {
        // 404 page
        res.render('pages/404', { title: '404 - Page Not Found', path: req.url });
    })

module.exports = routes;