"use strict";

const dotenv = require("dotenv");
dotenv.load();
const express = require("express");
const path = require("path");
const debug = require("debug")("auth0-link-accounts-sample");
const favicon = require("serve-favicon");
const logger = require("morgan");
const bodyParser = require("body-parser");
const { auth, requiresAuth } = require("express-openid-connect");

const index = require("./lib/routes/index");
const user = require("./lib/routes/user");
const link = require("./lib/routes/link");
const { post } = require("request");

const app = express();
// app.use(
//   auth({
//     authRequired: false,
//     routes: false, // disable default /login /logout routes.
//     auth0Logout: true,
//     httpOptions: {
//       timeout: 10000,
//     },
//   })
// );

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    //  routes: {
    //   login: false,
    //   logout: false,
    //  },
    // session: {
    //   name: "appsess"
    // },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.png")));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", index);
app.use("/user", requiresAuth(), user);
app.use("/link", link);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

module.exports = app;

function simpleStringify (object){
  // stringify an object, avoiding circular structures
  // https://stackoverflow.com/a/31557814
  var simpleObject = {};
  for (var prop in object ){
      if (!object.hasOwnProperty(prop)){
          continue;
      }
      if (typeof(object[prop]) == 'object'){
          continue;
      }
      if (typeof(object[prop]) == 'function'){
          continue;
      }
      simpleObject[prop] = object[prop];
  }
  return JSON.stringify(simpleObject); // returns cleaned up JSON
};