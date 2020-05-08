const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Twitter = require("twitter-lite");
const User = require("../models/authModel");

router.get("/getOAuthToken", (req, res, next) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  });

  client
    .getRequestToken(process.env.TWITTER_CALLBACK)
    .then((data) => {
      var info = {
        oauth_token: data.oauth_token,
        oauth_token_secret: data.oauth_token_secret,
      };
      console.log(info);
      let user = new User({
        _id: new mongoose.Types.ObjectId(),
        oauth_token: data.oauth_token,
        oauth_token_secret: data.oauth_token_secret,
      });
      user
        .save()
        .then((result) => {
          res.status(200).json(user);
        })
        .catch((error) => {
          res.status(400).json({
            msg: error,
          });
        });
    })
    .catch((error) => {
      res.status(400).json({
        msg: error,
      });
    });
});

router.get("/granted", (req, res, next) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  });

  let queryParams = req.query;
  //console.log(queryParams);

  let oauth_token = queryParams.oauth_token;
  let oauth_verifier = queryParams.oauth_verifier;

  User.findOne({
    oauth_token: oauth_token,
  })
    .exec()
    .then((result) => {
      let id = result._id;
      client
        .getAccessToken({
          key: result.oauth_token,
          secret: result.oauth_token_secret,
          verifier: oauth_verifier,
        })
        .then((result) => {
          updatedUser = new User({
            oauth_token_verifier: oauth_verifier,
            access_token: result.oauth_token,
            access_token_secret: result.oauth_token_secret,
            user_id: result.user_id,
            screen_name: result.screen_name,
            updated: Date.now(),
          });
          User.updateOne({ _id: id }, updatedUser)
            .exec()
            .then((result) => {
              //console.log(result);
              res.redirect(process.env.FRONTEND);
            });
        })
        .catch(console.error);
    });
});

router.post("/getTweets", async (req, res, next) => {
  let bodyParams = req.body;
  //console.log(bodyParams);

  let oauth_token = bodyParams.oauth_token;
  let query = bodyParams.query;

  try {
    User.findOne({
      oauth_token: oauth_token,
    })
      .exec()
      .then((result) => {
        const client = new Twitter({
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          access_token_key: result.access_token,
          access_token_secret: result.access_token_secret,
        });
        client
          .get("search/tweets", {
            q: query,
          })
          .then((response) => {
            res.status(200).json(response);
          });
      });
  } catch (error) {
    res
      .status(400)
      .json("Not Authenticated or Could not get data from Twitter");
  }
});

router.post("/verifyUser", async (req, res, next) => {
  let bodyParams = req.body;
  //console.log(bodyParams);

  let id = bodyParams.id;

  try {
    User.findOne({
      _id: id,
    })
      .exec()
      .then((result) => {
        if (result.access_token && result.access_token_secret) {
          res.status(200).json({ auth: true, userName: result.screen_name });
        } else {
          res.status(200).json({ auth: false });
        }
      });
  } catch (error) {
    res
      .status(400)
      .json("Not Authenticated or Could not get data from Twitter");
  }
});

module.exports = router;
