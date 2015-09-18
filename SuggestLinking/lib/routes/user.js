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
  //returning req.user._json, since it contains the user_metadata and app_metadata properties the root user doesn't have.
  res.render('user', { 
  	user: req.user._json, 
  	provider: req.user.provider, 
  	suggestedUsers: req.session.suggestedUsers || [], 
  	env:env, 
  	access_token:req.session.accessToken 
  });

});

router.post('/link-accounts/:targetUserId',ensureLoggedIn, function(req,res,next){
	Auth0Client.linkAccounts(req.user.id,req.params.targetUserId)
	.then( result => res.send(200,result))
	.catch( err => {
		console.log('Error linking accounts!',err);
		next(err);
	});
});

module.exports = router;