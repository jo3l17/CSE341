const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const { check, body } = require('express-validator/check');

// /admin/add-product => GET
router.get('/add-product',
    [
        body('title')
            .isAlphanumeric()
            .isLength({ min: 3 })
            .trim(),
        body('img').isURL(),
        body('price').isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],
    adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('img').isURL(),
        body('price').isFloat(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim()
    ],
    adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
