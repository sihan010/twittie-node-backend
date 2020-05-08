const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  let jsonResForHome = {
    'msg': "Here are all the available endpoints and all their desired actions",
    'res': [
      {
        'endpoint': "/engine/start",
        'description': "Starts engine for getting trends data from twitter"
      },
      {
        'endpoint': "/engine/stop",
        'description': "Stops getting data from twitter"
      },
      {
        'endpoint': "/trends",
        'description': "Sends all the trends available in Database"
      },
      {
        'endpoint': "/trends:woeid",
        'description': "Sends trend for single woeid location"
      },
      {
        'endpoint': "/user/getOAuthToken",
        'description': "Gets and sends basic token and token secret to request oauth tokens"
      },
      {
        'endpoint': "/user/granted",
        'description': "Twitter redirects to this url after permission has been given. Gets token verifier as query param"
      },
      {
        'endpoint': "/user/getTweets",
        'description': "Gets Tweets data from twitter and sends back to frontend. Post request with access token and tag in body"
      },
      {
        'endpoint': "/user/verifyUser",
        'description': "Gets user db entry id and checks if they are verified"
      },
    ]
  };
  res.status(200).jsonp(jsonResForHome);
});

module.exports = router;
