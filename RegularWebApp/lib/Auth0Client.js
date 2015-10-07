'use strict';

const request = require('request');

class Auth0Client {

	getUser(userId){
		return new Promise((resolve,reject) => {
			const reqOpts = {
				url:`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
				headers: {
					'Authorization': `Bearer ${process.env.AUTH0_APIV2_TOKEN}`
				}
			};
			console.log('reqOpts',reqOpts);
			request(reqOpts, (error, response, body) => {
				if (error) {
					return reject(error);
				} else if (response.statusCode !== 200) {
					return reject(`Error getting user with id ${userId}. Status code: ${response.statusCode}. Body: ${body}`);
				} else {
					resolve(JSON.parse(body));
				}
			});	
		});
	}

	getUsersWithSameVerifiedEmail(user) {
		console.log('getUsersWithSameVerifiedEmail - user',user);
		return new Promise((resolve, reject) => {
			if (! user.email_verified){
				reject(`User's email ${user.email} is not verified`);
			}
			const reqOpts = {
				url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
				headers: {
					'Authorization': `Bearer ${process.env.AUTH0_APIV2_TOKEN}`
				},
				qs: {
			    search_engine: 'v2',
			    q: `email:"${user.email}" AND email_verified:true -user_id:"${user.user_id}"`
			  }
			};
			console.log('reqOpts',reqOpts);
			request(reqOpts, (error, response, body) => {
				console.log('getUsersWithSameVerifiedEmail err, status, body',error,response.statusCode,body);
				if (error) {
					return reject(error);
				} else if (response.statusCode !== 200) {
					return reject(`Error getting users with same email. Status code: ${response.statusCode}. Body: ${body}`);
				} else {
					resolve(JSON.parse(body));
				}	
			});
		});
	}

	/*
	* Links Accounts
	* Links targetUserId account to rootUserId account  
	*
	* Example:
	*
	*  Auth0Client.linkAccounts('google-oauth2%7C115015401343387192604','sms|560ebaeef609ee1adaa7c551')
	*  .then( identities => {
  *    // use new user's array of identities
  *  })
  *  .catch( err => {
  *    // handle error
  *  });
	*  
	* @param {String} rootUserId
  * @param {String} targetUserId
  * @api public
	*/
	linkAccounts(rootUserId,targetUserId) {

		const provider = targetUserId.split('|')[0];
		const user_id = targetUserId.split('|')[1];

		return new Promise((resolve, reject) => {
			var reqOpts = {
				method: 'POST',
				url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${rootUserId}/identities`,
				headers: {
					'Authorization': `Bearer ${process.env.AUTH0_APIV2_TOKEN}`
				},
				json: {
		      provider,
		      user_id
		    }
		  };
		  request(reqOpts,(error, response, body) => {
				if (error) {
					return reject(error);
				} else if (response.statusCode !== 201) {
					return reject(`Error linking accounts. Status code: ${response.statusCode}. Body: ${JSON.stringify(body)}`);
				} else {
					resolve(body);
				}	
			});
		});
	}

	/*
	* Unlinks Accounts
	* Unlinks targetUserId account from rootUserId account  
	*
	* Example:
	*
	*  Auth0Client.unlinkAccounts('google-oauth2%7C115015401343387192604','sms|560ebaeef609ee1adaa7c551')
	*  .then( identities => {
  *    // use new user's array of identities
  *  })
  *  .catch( err => {
  *    // handle error
  *  });
	*  
	* @param {String} rootUserId
  * @param {String} targetUserId
  * @api public
	*/
	unlinkAccounts(rootUserId,targetUserId){
		const provider = targetUserId.split('|')[0];
		const user_id = targetUserId.split('|')[1];

		return new Promise((resolve,reject) => {
			var reqOpts = {
				method: 'DELETE',
				url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${rootUserId}/identities/${provider}/${user_id}`,
				headers: {
					'Authorization': `Bearer ${process.env.AUTH0_APIV2_TOKEN}`
				}
			};
			console.log('reqOpts',reqOpts);
			request(reqOpts,(error, response, body) => {
				if (error) {
					return reject(error);
				} else if (response.statusCode !== 200) {
					return reject(`Error unlinking accounts. Status code: ${response.statusCode}. Body: ${JSON.stringify(body)}`);
				} else {
					resolve(JSON.parse(body));
				}	
			});
		});
	}
}

module.exports = new Auth0Client();