const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const { check, body } = require('express-validator/check');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title', 'Please enter a valid title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('img', 'Please enter a valid image URL').isURL(),
        body('price', 'Please enter a valid Price').isFloat(),
        body('description', 'Please enter a valid description')
            .isLength({ min: 5, max: 400 })
            .trim(),
        body('stock', 'Please enter a valid stock').isNumeric()
            .isInt({ min: 0 })
    ],
    adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title', 'Please enter a valid title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('img', 'Please enter a valid image URL').isURL(),
        body('price', 'Please enter a valid Price').isFloat(),
        body('description', 'Please enter a valid description')
            .isLength({ min: 5, max: 400 })
            .trim(),
        body('stock', 'Please enter a valid stock').isNumeric()
            .isInt({ min: 0 })
    ],
    adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

router.post('/stock', adminController.postStock);

module.exports = router;
