'use strict';

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const Auth0Client = require('../Auth0Client');
const express = require('express');

const router = express.Router();

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
};

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res) {
  console.log('returning user',req.user._json);
  res.render('user', { 
    user: req.user._json, //returning req.user._json, since it contains the user_metadata and app_metadata properties the root user doesn't have.
    provider: req.user.provider, 
    suggestedUsers: req.session.suggestedUsers, 
    env:env, 
    access_token:req.session.accessToken 
  });
});

router.get('/suggested-users',ensureLoggedIn, (req,res) => {
  let suggestedUsers = [];
  Auth0Client.getUsersWithSameVerifiedEmail(req.user._json)
    .then(identities => {
      suggestedUsers = identities;
    }).catch( err => {
      console.log('There was an error retrieving users with the same verified email to suggest linking',err);
    }).then(() => {
      res.send(suggestedUsers);
    });
});

router.post('/link-accounts/:targetUserId',ensureLoggedIn, (req,res,next) => {
  // At this point you could get the target user's profile and apply any desired verification prior to linking
  // or save target user's profile data for merging with session user's data after successfully linking
  Auth0Client.linkAccounts(req.user.id,req.params.targetUserId)
  .then( identities => {
    req.user.identities = req.user._json.identities = identities;
    res.send(identities);
  })
  .catch( err => {
    console.log('Error linking accounts!',err);
    next(err);
  });
});

router.post('/unlink-accounts/:targetUserId',ensureLoggedIn, (req,res,next) => {
  Auth0Client.unlinkAccounts(req.user.id,req.params.targetUserId)
  .then( identities => {
    req.user.identities = req.user._json.identities = identities;
    res.send(identities);
  })
  .catch( err => {
    console.log('Error linking accounts!',err);
    next(err);
  });
});

module.exports = router;