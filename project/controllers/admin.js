const Product = require('../models/products');
const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
    res.render('project/admin/edit-product', {
        editing: false,
        hasError: false,
        title: 'Add Product',
        path: '/add-product',
        errorMessage: ''
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, img, price, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('project/admin/edit-product', {
            editing: false,
            title: 'Add Product',
            path: '/add-product',
            hasError: true,
            product: req.body,
            errorMessage: errors.array()[0].msg
        });
    }
    const product = new Product({
        title: title,
        img: img || "https://source.unsplash.com/featured/?" + title.split(' ').join('%20'),
        price: price,
        description: description,
        userId: req.user
    });
    product.save()
        .then(result => {
            console.log("Product Created!");
            res.redirect('/project');
        }).catch(err => {
            console.log(err);
        })
}

exports.getProducts = (req, res, next) => {
    Product.find({
        userId: req.user
    })
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('project/admin/products', {
                title: 'Admin products',
                products,
                hasProducts: products.length > 0,
                path: '/admin/products'
            });
        });
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('project/admin/edit-product', {
            title: 'Edit ' + product.title,
            editing: true,
            product,
            hasError: false,
            path: '/edit-product',
            errorMessage: ''
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.img;
    const updatedDesc = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('project/admin/edit-product', {
            editing: true,
            title: 'Edit ' + req.body.title,
            path: '/add-product',
            hasError: true,
            product: req.body,
            errorMessage: errors.array()[0].msg
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
            return product.save().then(result => {
                console.log('UPDATED PRODUCT!');
                res.redirect('/project/admin/products');
            })
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({ id: prodId, userId: req.user._id })
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/project/admin/products');
        })
        .catch(err => console.log(err));
};