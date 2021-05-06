const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    res.render('project/add-product', {
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
        res.render('project/product-detail',{
            title: product.title,
            product,
            path: '/product'
        })
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('project/index', {
            title: 'Project',
            products,
            hasProducts: products.length > 0,
            path: '/'
        });
    });
}