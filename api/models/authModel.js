let mongoose = require('mongoose');

let authModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    oauth_token: {
        type: String,
        required: true
    },
    oauth_token_secret: {
        type: String,
        required: false
    },
    oauth_token_verifier: {
        type: String,
        required: false
    },
    access_token: {
        type: String,
        required: false
    },
    access_token_secret: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: false
    },
    screen_name: {
        type: String,
        required: false
    },
    updated:{
        type:Date,
        require:true
    }
})

module.exports = mongoose.model("Auth", authModel);