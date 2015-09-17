# auth0-link-accounts-sample
Example of how manage linked accounts

## Scenarios
There are many typicall scenarios related to linking accounts. We can describe some of them:



### 1. Automatic Account Linking
There is a sample [Account Linking Rule](https://github.com/auth0/rules/blob/master/rules/link-users-by-email.md) for automatically linking users by email on authentication. 
In this case the user authenticates to the App using Auth0, and by configuring this rule, it will automatically link other accounts with same email address.

### 2. Manually link accounts, starting from an App button
In this case the user logins to the App using any of the available identity providers. He then has the option within the app, to link the account with other accounts. This can be useful in case of a user that first registered with username & password, but then wants to use a social login instead to don't have to remember the password.
Another use case, is when the app wants to interact with several social APIs, like posting a message to Twitter & Facebook at the same time.
* [SPA example](/SPA)
* [Regular Web App example](/RegularWebApp)

### 3. Merge account settings from different linked accounts
In this scenario a user may have logged in to the app with an account and save some preferences. Then he logins with another account and have some other data associated with that. Finally he merges the two accounts and have to solve conflicts and merge metadata.

## Install
How to get the sample or install the product

## Usage
How to run the sample or start using the product

## API Reference
Details on the API if applicable

## Examples
Examples of how to use the sample/product

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