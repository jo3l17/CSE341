const Product = require('../models/products');

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('project/product-detail', {
            title: product.title,
            product,
            path: '/product'
        });
    });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('project/index', {
                title: 'Shop',
                products,
                hasProducts: products.length > 0,
                path: '/'
            });
        });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/project');
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('project/cart', {
                title: 'Cart',
                products,
                path: '/cart',
                hasProducts: products.length > 0
            });
        }).catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/project/cart');
        })
        .catch(err => console.log(err));
};