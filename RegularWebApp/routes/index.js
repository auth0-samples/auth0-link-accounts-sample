'use strict';

const express = require('express');
const passport = require('passport');

const router = express.Router();

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Account Linking Sample', env: env });
});

router.get('/login', (req, res) => {
    res.render('login', { env: env });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  //TODO: add middleware to check if the query string has an error message
  //example: callback?error=invalid_connection&error_description=the%20connection%20was%20not%20found 302 1.537 ms - 68
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/user');
  });

module.exports = router;