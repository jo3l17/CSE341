exports.renderLogin = (req, res, next) => {
    res.render('pages/pa12-login', {
        title: 'Prove Assignment 12',
        path: '/pa12',
    });
}
exports.renderChat = (req, res, next) => {
    res.render('pages/pa12-chat', {
        title: 'Chat',
        path: '/pa12-chat',
        user: req.session.user,
    });
}