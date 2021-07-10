const express = require('express');
const router = express.Router();
const pa12controller = require('../../controllers/pa12');
const users = []; // Dummy array for users

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../../data/avengers.json');

router.get('/', pa12controller.renderLogin);
router.get('/chat', pa12controller.renderChat);
// Verify login submission to access chat room.
router.post('/login', (req, res, next) => {
    // Extract username from req.body
    const { username } = req.body;
    // Do some simple validation
    if (!username || username.trim() === '')
        // HTTP 400 = BAD REQUEST
        return res.status(400).send({ error: 'Username cannot be empty!' });
    // Check for duplicates
    if (users.includes(username.trim()))
        // HTTP 409 = CONFLICT
        return res.status(409).send({ error: 'Username exists!' });
    // No errors, add to the list and send the username back
    users.push(username.trim());
    req.session.users = users;
    req.session.user = username;
    res.status(200).send({ username: username.trim() });
});

module.exports = router;