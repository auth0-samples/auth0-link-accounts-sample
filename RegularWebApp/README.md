# Auth0 Node.js Regular Web App Account Linking Sample

This Node.js Regular Web App serves as an example of the [Suggested Account Linking Scenario](https://auth0.com/docs/link-accounts/suggested-linking), where the App searches for other accounts with same verified email address after user logs in, and suggests him to link the accounts if any match is found.

## Key Features

* Login with any available connection using [Lock](https://github.com/auth0/lock)
* Login with email passwordless connections, using [Lock Passwordless](https://github.com/auth0/lock-passwordless)
* Suggestion of linking to other accounts if other accounts with same verified email address are found
* Automatically merge user_metadata and app_metadata on account linking
* Display of current profile and linked accounts
* Option to unlink an account

![](regular-web-app-suggest-linking.png)

![](regular-web-app-user-settings.png)

## Install Locally

1. Install Node.js v4.0.0 or later
2. Generate an APIv2 token with `read:users` and `update:users` scopes.
3. Add a .env file containing your credentials. You can use sample.env as template.
4. In your App's configuration on the [Auth0 Dashboard](https://manage.auth0.com), add `http://localhost:3000/callback` to the list of **Allowed Callback URLs**. 
5. Make sure you have at least two enabled econnections where you can login with the same email.
6. Run: `npm install` and `npm run start`
7. Go to `http://localhost:3000` and you'll see the app running :).

## Usage

* Go to http://localhost:3000 and press any of the login buttons to log in to the App.
* In order to see the suggestion to link to other accounts with same verified email, you need to have another user associated with the app. If you don't see it, you can logout and login again with another account with same email. If you use a passwordless connection, the email will be automatically verified on login.
* In order to test the merging of app_metadata and user_metadata, make sure both users have some data before linking the accounts.
* You will see a modal suggesting you to link the accounts that have same verified email addresses. 
* Click the button to link the accounts.
* Try unlinking accounts, too.