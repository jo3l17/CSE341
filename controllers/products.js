const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    res.render('pages/project/add-product', {
        title: 'Add Product',
        path: '/add-product',
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body);
    product.save();
    res.redirect('/project');
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('pages/project/product-detail',{
            title: product.title,
            product,
            path: '/product'
        })
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('pages/project/index', {
            title: 'Project',
            products,
            hasProducts: products.length > 0,
            path: '/'
        });
    });
}