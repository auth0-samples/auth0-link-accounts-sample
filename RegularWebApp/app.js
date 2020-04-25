"use strict";

const dotenv = require("dotenv");
dotenv.load();
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { auth, requiresAuth } = require("express-openid-connect");

const index = require("./lib/routes/index");
const user = require("./lib/routes/user");
const link = require("./lib/routes/link");

const app = express();
app.use(
  auth({
    required: false,
    routes: false, // disable default /login /logout routes.
    appSession: {
      cookieSameSite: "None",
    },
    httpOptions: {
      timeout: 10000,
    },
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
app.use("/link", requiresAuth(), link);

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
