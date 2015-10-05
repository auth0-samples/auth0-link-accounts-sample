# Auth0 jQuery Link Accounts Sample

This sample application shows how to link and unlink accounts from client side within a SPA.

## Key Features

The Linking Accounts sample SPA includes:

* Login with any of the available connections, using Lock
* Display of current profile and already linked accounts
* Option to unlink an account
* Option to link another account
* Option to link another account with a specific connection (i.e. facebook, twitter, etc)
* Option to link to passwordless accounts

You can read more about Account Linking on our [Doc's Site](https://auth0.com/docs/link-accounts).

## Install locally

1. Create an auth0-variables.js file with your Auth0 credentials. You can use auth0-variables.sample.js as a template. You can get the clientId and domain from the [Auth0 Dashboard](https://manage.auth0.com).
2. In your App's configuration on the [Auth0 Dashboard](https://manage.auth0.com), add `http://localhost:3000` to the list of **Allowed Callback URLs**. 
3. Initialize a web server in the samples folder. You can do it for instance with `serve`:
	* Install node
	* run `npm install -g serve`
	* run `serve` in the project's folder to start a server
4. Go to the [index page](http://localhost:3000) and start playing with the app! 

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
