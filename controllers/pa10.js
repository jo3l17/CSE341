exports.renderPage = (req, res, next) => {
    res.render('pages/pa10', {
        title: 'Prove Assignment 10',
        path: '/pa10',
    });
}