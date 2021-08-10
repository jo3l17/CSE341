const express = require('express');
const router = express.Router();
const pa12controller = require('../../controllers/pa12');


router.get('/', pa12controller.renderLogin);
router.get('/chat', pa12controller.renderChat);
router.post('/login', pa12controller.login);

module.exports = router;