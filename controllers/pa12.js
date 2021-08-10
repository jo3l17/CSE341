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

const users = [];
exports.login = (req, res, next) => {
    const { username } = req.body;
    if (!username || username.trim() === '')
        return res.status(400).send({ error: 'Username cannot be empty!' });
    if (users.includes(username.trim()))
        return res.status(409).send({ error: 'Username exists!' });
    users.push(username.trim());
    req.session.users = users;
    req.session.user = username;
    res.status(200).send({ username: username.trim() });
}