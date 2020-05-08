//imports
let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let trendsRoutes = require("./api/routes/trends");
let engineRoutes = require("./api/routes/engine");
let docs = require("./api/routes/docs");
let userAuth = require("./api/routes/userAuth");
let app = express();

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTION") {
    res.header("Access-Control-Allow-Methods", "POST, GET");
    return res.status(200).json({});
  }
  next();
});

//routes
app.use("/user", userAuth);
app.use("/docs", docs);
app.use("/trends", trendsRoutes);
app.use("/engine", engineRoutes);

//database connectivity
mongoose.connect(
  process.env.DB_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    console.log(process.env.DB_STRING);
    if (err) {
      console.log("database connection error", err);
      return;
    }
    console.log("connected to database");
  }
);

//error handlers
app.use((req, res, next) => {
  let error = new Error("Resource Not Found !");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error"
  });
});

module.exports = app;
