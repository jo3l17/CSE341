const Product = require('../models/products');
const { validationResult } = require('express-validator/check');
const errorHandler = require('../middleware/errorHandling');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        editing: false,
        hasError: false,
        title: 'Add Product',
        path: '/add-product',
        errorMessage: '',
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, img, price, description, stock } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            editing: false,
            title: 'Add Product',
            path: '/add-product',
            hasError: true,
            product: req.body,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const product = new Product({
        title,
        img: img || "https://source.unsplash.com/featured/?" + title.split(' ').join('%20'),
        price,
        description,
        userId: req.user,
        stock
    });
    product.save()
        .then(result => {
            console.log("Product Created!");
            res.redirect('/project');
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.getProducts = (req, res, next) => {
    Product.find({
        userId: req.user
    })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                title: 'Admin products',
                products,
                hasProducts: products.length > 0,
                path: '/admin/products'
            });
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('admin/edit-product', {
            title: 'Edit ' + product.title,
            editing: true,
            product,
            hasError: false,
            path: '/edit-product',
            errorMessage: '',
            validationErrors: []
        });
    })
    .catch(err => errorHandler.showError(err, next));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.img;
    const updatedDesc = req.body.description;
    const updatedStock = req.body.stock;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            editing: true,
            title: 'Edit ' + req.body.title,
            path: '/add-product',
            hasError: true,
            product: req.body,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/project');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.img = updatedImageUrl;
            product.description = updatedDesc;
            product.stock = updatedStock;
            return product.save().then(result => {
                console.log('UPDATED PRODUCT!');
                res.redirect('/project/admin/products');
            })
        })
        .catch(err => errorHandler.showError(err, next));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({ id: prodId, userId: req.user._id })
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/project/admin/products');
        })
        .catch(err => errorHandler.showError(err, next));
};

exports.postStock = (req, res, next) => {
    const { modifyStock, productId } = req.body;
    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/project');
            }
            if (modifyStock == '+') {
                product.stock += 1;
            } else if (product.stock > 0) {
                product.stock -= 1;
            }
            return product.save().then(result => {
                console.log('UPDATED STOCK!');
                res.redirect('/project/admin/products');
            })
        })
        .catch(err => errorHandler.showError(err, next));
}