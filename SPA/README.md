# Auth0 jQuery Single Page App Account Linking Sample

This Single Page App serves as an example of the [User Initiated Account Linking Scenario](https://auth0.com/docs/link-accounts/user-initiated), where the user can click on a **link account** button and login with other identity to link to. 

## Key Features

* Login with any available connection using [Lock](https://github.com/auth0/lock)
* Login with any passwordless connections, using [Lock Passwordless](https://github.com/auth0/lock-passwordless)
* Display of current profile and already linked accounts
* Option to unlink an account
* Option to link another account
* Option to link another account with a specific connection (i.e. facebook, twitter, etc)
* Option to link to a passwordless account

![](spa-user-settings.png)

## Install Locally

1. Create an auth0-variables.js file with your Auth0 credentials. You can use auth0-variables.sample.js as a template. You can get the clientId and domain from the [Auth0 Dashboard](https://manage.auth0.com).
2. In your App's configuration on the [Auth0 Dashboard](https://manage.auth0.com), add `http://localhost:3000` to the list of **Allowed Callback URLs**. 
3. Initialize a web server in the samples folder. You can do it for instance with `serve`:
	* Install node
	* run `npm install -g serve`
	* run `serve` in the project's folder to start a server
4. Go to the [index page](http://localhost:3000) and start playing with the app! 