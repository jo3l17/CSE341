//pa04 PLACEHOLDER
const express = require('express');
const router = express.Router();
const pa09controller = require('../../controllers/pa09');

router.get('/:page?',pa09controller.getPokemonList);

module.exports = router;