exports.redirect505 = (err, req, res, next) => {
    res.status(err.httpStatusCode || 500)
    .render('500',
        { title: '500 - Error', path: req.url })
}
exports.showError = (err, next) => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
}