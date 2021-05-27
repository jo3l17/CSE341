const Product = require('../models/products');
const Order = require('../models/order');
const errorHandler = require('../middleware/errorHandling');

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        res.render('product-detail', {
            title: product.title,
            product,
            path: '/product',
        });
    })
        .catch(err => errorHandler.showError(err, next));
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('index', {
                title: 'Shop',
                products,
                hasProducts: products.length > 0,
                path: '/'
            });
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            if (product.stock > 0) {
                product.stock -= 1;
                return product.save()
                    .then(product => {
                        return req.user.addToCart(product)
                    });
            } else {
                return res.redirect('/project/products')
            }
        })
        .then(result => {
            console.log(result);
            res.redirect('/project/products');
        })
        .catch(err => errorHandler.showError(err, next));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            console.log(products);
            let total = 0;
            products.forEach(product => {
                price = product.productId.price * product.quantity;
                total += price;
            });
            total = total.toFixed(2);
            res.render('cart', {
                title: 'Cart',
                products,
                path: '/cart',
                hasProducts: products.length > 0,
                total
            });
        })
        .catch(err => errorHandler.showError(err, next));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId, quantity } = req.body;
    Product.findById(prodId)
        .then(product => {
            product.stock += parseInt(quantity);
            return product.save()
        }).then(product => {
            req.user
                .removeFromCart(productId)
                .then(result => {
                    res.redirect('/project/cart');
                })
        })
        .catch(err => {
            console.log(err)
            res.redirect('/project/cart');
        });
};

exports.postOrder = (req, res, next) => {
    const { total } = req.body;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } }
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products,
                total
            });
            order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/project/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            res.render('orders', {
                title: 'Orders',
                path: '/orders',
                orders
            });
        })
        .catch(err => console.log(err));
};
