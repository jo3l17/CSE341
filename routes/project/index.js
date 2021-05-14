const projectRoutes = require('express').Router();
const errorController = require('../../controllers/error');
const productsController = require('../../controllers/products');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');

projectRoutes
    .get('/', productsController.getProducts)
    .use('/admin', adminRoutes)
    .use(shopRoutes)
    // .get('/add-product',productsController.getAddProduct)
    // .get('/products/:productId',productsController.getProduct)
    // .post('/add-product',productsController.postAddProduct)
    .use(errorController.get404);

module.exports = projectRoutes;