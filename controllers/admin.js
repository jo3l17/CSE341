const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
    res.render('project/admin/edit-product', {
        editing: false,
        title: 'Add Product',
        path: '/add-product',
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, img, price, description } = req.body;
    const product = new Product({
        title: title,
        img: img || "https://source.unsplash.com/400x400/?product+" + title.split(' ').join('+'),
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

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('project/admin/edit-product', {
            title: 'Edit ' + product.title,
            editing: true,
            product,
            path: '/edit-product'
        });
    });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('project/admin/products', {
                title: 'Admin products',
                products,
                hasProducts: products.length > 0,
                path: '/'
            });
        });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.img = updatedImageUrl;
        product.description = updatedDesc;
        return product.save()
    })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/project/admin/products');
        })
        .catch(err => console.log(err));
};
