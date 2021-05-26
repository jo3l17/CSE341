const projectRoutes = require('express').Router();
const errorController = require('./controllers/error');
const productsController = require('./controllers/products');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const isAuth = require('./middleware/is-auth');

projectRoutes
    .get('/', productsController.getProducts)
    .use('/admin', isAuth, adminRoutes)
    .use(authRoutes)
    .use(shopRoutes)
    .use(errorController.get404);

module.exports = projectRoutes;