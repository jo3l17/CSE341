exports.get404 = (req, res, next) => {
    // 404 page
    res.status(404).render('project/404', { title: '404 - Page Not Found', path: req.url })
}