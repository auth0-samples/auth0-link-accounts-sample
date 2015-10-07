# Auth0 Node.js Regular Web App Account Linking Sample

This sample shows how to link/unlink accounts from server side code within a Node.js Regular Web App.

You can read more about Account Linking on our [Doc's Site](https://auth0.com/docs/link-accounts).

## Key Features

* Login with any available connection using **Lock**
* Login with any passwordless connections, using **Lock Passwordless**
* Notice of existance of other accounts with same verified email address to link to
* Display of current profile and already linked accounts
* Option to **unlink** an account
* Option to link another account
* Option to link to a passwordless account

![](https://raw.githubusercontent.com/auth0/auth0-link-accounts-sample/master/RegularWebApp/regular-web-app-suggest-linking.png)

![](https://raw.githubusercontent.com/auth0/auth0-link-accounts-sample/master/RegularWebApp/regular-web-app-user-settings.png)

## Install Locally

1. Install Node.js v4.0.0 or later
2. Generate an APIv2 token with `read:users` and `update:users` scopes.
3. Add a .env file containing your credentials. You can use sample.env as template.
4. In your App's configuration on the [Auth0 Dashboard](https://manage.auth0.com), add `http://localhost:3000/callback` and `http://localhost:3000/user` to the list of **Allowed Callback URLs**. 
5. Run:
	```
	npm install 
	npm run start
	```
6. Go to http://localhost:3000 and you'll see the app running :).

## Usage

* Go to http://localhost:3000 and press any of the login buttons to log in to the App.
* In order to see the suggestion to link to other accounts with same verified email, you need to have another user associated with the app. If you don't see it, you can logout and login again with another account with same (verified) email.
* You will see a modal suggesting you to link the accounts that have same verified email addresses. 
* Click the button to link the accounts.
* You can also click on any of the link accounts buttons to manually initiate an account linking
* Try unlinking accounts, too.

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