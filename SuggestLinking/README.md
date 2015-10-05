# auth0-link-accounts-sample/SuggestLinking

## Key Features

In this scenario a user may have logged in to the app with an account and save some preferences. Then he logins with another account and have some other data associated with that. The app checks if there are associated accounts created on login, and suggest to link the accounts. The app and/or the user has the possibility of merging the associated data before linking.

1. Install Node.js v4.0.0 or later
2. Generate an APIv2 token with `read:users` and `update:users` scopes.
3. Add a .env file containing your credentials. You can use sample.env as template.
4. In your App's configuration on the [Auth0 Dashboard](https://manage.auth0.com), add `http://localhost:3000/callback` to the list of **Allowed Callback URLs**. 
5. Run:
	```
	npm install 
	npm run start
	```
6. Go to http://localhost:3000 and you'll see the app running :).

## Usage

* Go to http://localhost:3000 and press the login button. Login with any provider and account.
* In order to see the suggestion to link to other accounts with same verified email, you need to have another user associated with the app. If you don't see it, you can logout and login again with another account with same (verified) email.
* You will see a modal suggesting you to link the accounts that have same verified email addresses. 
* Click the button to link the accounts.

|Notice that at this point you have all the user information before linking. So you can save or merge the user_metadata and app_metadata. Otherwise, it will be lost after linking.

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