exports.get404 = (req, res, next) => {
    // 404 page
    res.status(404)
    .render('project/404',
    { title: '404 - Page Not Found', path: req.url })
}
exports.get500 = (req, res, next) => {
    // 500 page
    res.status(404)
    .render('project/500',
    { title: '500 - Error', path: req.url })
}