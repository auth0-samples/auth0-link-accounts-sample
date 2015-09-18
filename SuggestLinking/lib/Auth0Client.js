'use strict';

const request = require('request');

class Auth0Client {

	getUsersWithSameVerifiedEmail(user) {
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

	linkAccounts(rootUserId,targetUserId) {

		const provider = targetUserId.split('|')[0];
		const user_id = targetUserId.split('|')[1];

		return new Promise((resolve, reject) => {
			var reqOpts = {
				url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${rootUserId}/identities`,
				headers: {
					'Authorization': `Bearer ${process.env.AUTH0_APIV2_TOKEN}`
				},
				json: {
		      provider,
		      user_id
		    }
		  };
		  console.log('reqOpts',reqOpts);
			request(reqOpts,(error, response, body) => {
				if (error) {
					return reject(error);
				} else if (response.statusCode !== 200) {
					return reject(`Error linking accounts. Status code: ${response.statusCode}. Body: ${JSON.stringify(body)}`);
				} else {
					resolve(body);
				}	
			});
		});
	}

}

module.exports = new Auth0Client();