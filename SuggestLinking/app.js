'use strict';

const dotenv = require('dotenv');
dotenv.load();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const Auth0Client = require('./lib/Auth0Client');
const routes = require( './lib/routes/index');
const user = require('./lib/routes/user');

// This will configure Passport to use Auth0
let strategy = new Auth0Strategy({
    domain:       process.env.AUTH0_DOMAIN,
    clientID:     process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:  process.env.AUTH0_CALLBACK_URL,
    //passReqToCallback is needed for having the req available in the callback to gain access to the session
    passReqToCallback: true 
  }, function(req, accessToken, refreshToken, extraParams, profile, done) {
    
    console.log('profile',profile);

    // accessToken is the token to call Auth0 API. We will need it to link accounts
    req.session.accessToken = accessToken;

    //look for users with same email
    Auth0Client.getUsersWithSameVerifiedEmail(profile._json)
      .then(identities => {
        req.session.suggestedUsers = identities;
      }).catch( err => {
        console.log('There was an error retrieving users with the same verified email to suggest linking',err);
      }).then(() => {
        return done(null, profile);
      });

  });


passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
