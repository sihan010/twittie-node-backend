require("dotenv").config();
let fs = require("fs");
let Twitter = require("twitter");
let mongoose = require("mongoose");
let Trend = require("./api/models/trendModel");
const fetch = require("node-fetch");

let intervalId = null;

const twitterApiData = () => {
  //initializations
  let woeid = [];
  let counter = 0;
  let totalData = 0;
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  //read woeid list and get trends from twitter
  fs.readFile("./available.json", "utf8", (err, data) => {
    if (err) {
      console.err(err);
      return;
    }

    dataJSON = JSON.parse(data);
    totalData = dataJSON.length;
    for (let i = 0; i < dataJSON.length; i++) {
      woeid.push(dataJSON[i].woeid);
    }

    intervalId = setInterval(() => {
      client.get("trends/place", { id: woeid[counter] }, (error, response) => {
        if (!error) {
          saveToDatabase(
            response[0],
            woeid[counter],
            response[0].locations[0].name
          );
          console.log(`${counter + 1}th trend pushed to database`);
          counter++;
          if (counter == totalData) counter = 0;
        } else {
          console.err("twitter api error: ", error);
        }
      });
    }, 20000);
  });
};

const saveToDatabase = (data, woeid, place) => {
  Trend.find({ woeid: woeid })
    .exec()
    .then(result => {
      if (result.length >= 1) {
        let id = result[0]._id;
        Trend.replaceOne(
          { _id: id },
          {
            woeid: woeid,
            place: place,
            trend: JSON.stringify(data)
          },
          (err, result) => {
            console.log(`trend updated at ${Date.now()}`);
          }
        ).catch(err => console.err("update error: ", err));
      } else {
        let trend = new Trend({
          _id: new mongoose.Types.ObjectId(),
          woeid: woeid,
          place: place,
          trend: JSON.stringify(data)
        });
        trend
          .save()
          .then((err, result) => {
            console.log(`trend created at ${Date.now()}`);
          })
          .catch(err => console.err("update error: ", err));
      }
    })
    .catch(err => console.err("post request to /trends err: ", err));
};

// Gets all places from available.json, in which all available trendy places oftwitter are stored
// for each place it gats reverse geo code date from opencagedata.com and
// stores the 1st result along with place name and woeid in geoData.json
// Deprecated
const updateGeoData = () => {
  fs.readFile("./available.json", "utf8", (err, data) => {
    if (err) {
      console.log("Couldn't read woeid places list", err);
      return;
    }

    let names = [];
    let results = [];
    let counter = 1;
    let intervalId = null;

    dataJSON = JSON.parse(data);

    for (let i = 1; i < dataJSON.length; i++) {
      names.push({
        place: dataJSON[i].name + ", " + dataJSON[i].countryCode,
        woeid: dataJSON[i].woeid
      });
    }

    totalData = dataJSON.length;
    let baseUrl = "https://api.opencagedata.com/geocode/v1/json?q=";

    intervalId = setInterval(() => {
      let endpoint = `${baseUrl}${names[counter].place}&key=f5e618e973cd4bd6a9d84bca423a53f0&pretty=1`;
      console.log(counter,": " + endpoint);
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          console.log("data from - " + endpoint);
          results.push({
            place: names[counter].place,
            woeid: names[counter].woeid,
            geoData: data.results[0]
          });
        })
        .catch(err => {
          console.log(counter,": error at - " + endpoint, err);
          clearInterval(intervalId);
          counter = 0;
        });
      counter++;
      if (counter == 5) {
        clearInterval(intervalId);
        counter = 0;
        fs.writeFile("./geoData.json", JSON.stringify(results), () => {
          console.log("data flushed to geoData.json");
        });
      }
    }, 10000);
  });
};

const startDataCollection = () => {
  twitterApiData();
};

const stopDataCollection = () => {
  console.log("stopping engine: ", intervalId);
  clearInterval(intervalId);
  intervalId = null;
};

module.exports = {
  startDataCollection,
  stopDataCollection,
};
