'use strict';

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/');
const Auth0Client = require('../Auth0Client');
const express = require('express');
const router = express.Router();
const _ = require('lodash');

const ManagementClient = require('auth0').ManagementClient
const management = new ManagementClient({
  token: process.env.AUTH0_APIV2_TOKEN,
  domain: process.env.AUTH0_DOMAIN
});

/*
* Recursively merges user_metadata and app_metadata from secondary into primary user.
* Data of primary user takes preponderance.
* Array fields are joined.
*/
function _mergeMetadata(primaryUser, secondaryUser){
  
  const customizerCallback = function(objectValue, sourceValue){
    if (_.isArray(objectValue)){
      return sourceValue.concat(objectValue);
    }
  };
  const mergedUserMetadata = _.merge({}, secondaryUser.user_metadata, primaryUser.user_metadata, customizerCallback);
  const mergedAppMetadata = _.merge({}, secondaryUser.app_metadata, primaryUser.app_metadata, customizerCallback);
  
  return Promise.all([
    management.users.updateUserMetadata({ id: primaryUser.sub }, mergedUserMetadata),
    management.users.updateAppMetadata({ id: primaryUser.sub }, mergedAppMetadata)
  ]).then(result => {
    //save result in primary in session
    primaryUser.user_metadata = result[0].user_metadata;
    primaryUser.app_metadata = result[1].app_metadata;
  });
}

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res) {
  console.log('user', req.user);
  
  Auth0Client.getUser(req.user._json.sub)
    .then(user =>  {
      console.log('returning user', user);
      res.render('user', { 
        user: user, //returning req.user._json, since it contains the user_metadata and app_metadata properties the root user doesn't have.
          })
    })
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

router.post('/link-accounts/:targetUserId', ensureLoggedIn, (req,res,next) => {
    // Fetch target user to make verifications and merge metadata
  
    Auth0Client.getUser(req.params.targetUserId)
    .then( targetUser => {

      // verify email (this is needed because targetUserId came from client side)
      if(! targetUser.email_verified || targetUser.email !== req.user._json.email){
        throw new Error('User not valid for linking');
      }
  
      //merge metadatax
      return _mergeMetadata(req.user._json, targetUser);
    })
    .then(() => {
      return Auth0Client.linkAccounts(req.user._json.sub, req.params.targetUserId);
    })
    .then( identities => {
      req.user.identities = req.user._json.identities = identities;
      res.send(identities);
    })
    .catch( err => {
      console.log('Error linking accounts!',err);
      next(err);
    });
});

router.post('/unlink-accounts/:targetUserProvider/:targetUserId',ensureLoggedIn, (req,res,next) => {
  Auth0Client.unlinkAccounts(req.user._json.sub, req.params.targetUserProvider, req.params.targetUserId)
  .then( identities => {
    req.user.identities = req.user._json.identities = identities;
    res.send(identities);
  })
  .catch( err => {
    console.log('Error unlinking accounts!',err);
    next(err);
  });
});

module.exports = router;
