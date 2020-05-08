let mongoose = require('mongoose');

let trendModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    woeid: {
        type: Number,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    trend: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Trends", trendModel);