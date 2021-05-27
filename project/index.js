const projectRoutes = require('express').Router();
const errorController = require('./controllers/error');
const productsController = require('./controllers/products');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const isAuth = require('./middleware/is-auth');
const errorHandler = require('./middleware/errorHandling');

projectRoutes
    .get('/', productsController.getProducts)
    .use('/admin', isAuth, adminRoutes)
    .use(authRoutes)
    .use(shopRoutes)
    .get('/500', errorController.get500)
    .use(errorController.get404)
    .use(errorHandler.redirect505);

module.exports = projectRoutes;