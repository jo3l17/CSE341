//pa04 PLACEHOLDER
const express = require('express');
const router = express.Router();
const pa08controller = require('../../controllers/pa08');

router.get('/',pa08controller.processData);

module.exports = router;