const express = require('express');
const router = express.Router();
const dataCollector = require('../../dataCollector');

router.get('/start', (req, res, next) => {
    dataCollector.startDataCollection();
    res.status(200).json({
        "message":"scrapping engine started"
    })
})

router.get('/stop', (req, res, next) => {
    dataCollector.stopDataCollection();
    res.status(200).json({
        "message":"scrapping engine stopped"
    })
})

module.exports = router;