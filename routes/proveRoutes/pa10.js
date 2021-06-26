const express = require('express');
const router = express.Router();
const pa10controller = require('../../controllers/pa10');

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../../data/avengers.json');

router.get('/', pa10controller.renderPage);

router.get('/fetchAll', (req, res, next) => {
    res.json(dummyData);
});

router.post('/insert', (req, res, next) => {
    if (req.body.newAvenger !== undefined) {
        const newAvenger = req.body.newAvenger
        if (!dummyData.avengers.some(a => a.name === newAvenger)) {
            dummyData.avengers.push({ name: newAvenger })
            res.sendStatus(200)
        }
    } else {
        res.sendStatus(400)
    }
});

module.exports = router;