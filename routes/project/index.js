const projectRoutes = require('express').Router();
const errorController = require('../../controllers/error');
const productsController = require('../../controllers/products');

projectRoutes
    .get('/', productsController.getProducts)
    .get('/add-product',productsController.getAddProduct)
    .get('/products/:productId',productsController.getProduct)
    .post('/add-product',productsController.postAddProduct)
    .use(errorController.get404);

module.exports = projectRoutes;