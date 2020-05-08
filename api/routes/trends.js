const express = require('express');
const router = express.Router();
const Trend = require("../models/trendModel");

// trends
// returns trends for every location in database table
router.get('/', (req, res, next) => {
    Trend.find().exec().then(result => {
        res.status(200).json({
            "message": "sending all the trends in database",
            "trend": result
        })
    }).catch(err => console.log("get request to /trends err: ", err));
})

// trends/:woeid
// returns trend for a single woeid location
router.get('/:woeid', (req, res, next) => {
    let woeid = req.params.woeid;
    Trend.find({ "woeid": woeid }).exec().then(result => {
        if (result.length == 1) {
            res.status(200).json({
                "message": `sending trends of woeid:${woeid}`,
                "trend": result[0]
            })
        }
        else {
            res.status(200).json({
                "message": `no trend found for woeid:${woeid}`,
                "trend": []
            })
        }
    })
})

module.exports = router;