# auth0-link-accounts-sample/RegularWebApp
Example of how to manage linked accounts from a regular Node.js web application.

In this case the user logins to the App using any of the available identity providers. He then has the option inside the app, to link the account with other accounts. This can be useful in case of a user that first registered with username & password, but then wants to use a social login instead to don't have to remember the password.
Another use case, is when the app wants to interact with several social APIs, like posting a message to Twitter & Facebook at the same time.

## Install Locally

In order to run the example locally you would need to:

* Clone the auth0-link-accounts-sample repository
* Install Node.js v4.0.0 or later
* Add a .env file containing your credentials. You can use sample.env as template.
* On the RegularWebApp dir, run:

	```
	npm install 
	npm run start
	```

* Go to http://localhost:3000 and you'll see the app running :).

## Usage

* Go to http://localhost:3000 and press the login button. 
* Login with any provider and account.
* You will see your profile details, any other accounts already linked and a button to link a new account
* Press the button to link a new account. You will be prompted to login with the new account.
* After linking the account your profile will be updated with the new identity on the linked accounts list. Notice that the primary user_id and all main profile properties are referring to the first identity the user authenticated with.

### Case of linking an existant user

* Make sure you have two (unlinked) users related to the app, each one with its one app_metadata and user_metadata. You can see them in the Auth0 Dashboard.
* Login to the RegularWebApp sample and link the other account. Notice how the app_metadata and user_metadata of the linked account is lost, and only the metadata from the main profile is conserved. Even if you unlink the accounts, the app_metadata and user_metadata of the second user is lost.

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