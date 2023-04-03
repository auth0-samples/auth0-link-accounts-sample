"use strict";

const debug = require("debug")("auth0-link-accounts-sample");

const router = require("express").Router();
const auth0Client = require("../Auth0Client");
const { Errors, clear } = require("../flashErrors");

/* GET user profile. */
router.get("/", async (req, res) => {

  // Clear up linking cookie as we don't need it here
  res.clearCookie('linker', { path: '/' });
  if (req.appSession.error) {
    err = req.appSession.error;
    res.render("error", err);
  }
  const { sub, email_verified } = req.oidc.user;
  //fetch user profile containing the user_metadata and app_metadata properties
  try {
    let getUsersWithSameVerifiedEmail = [];
    const getUserProfile = auth0Client.getUser(sub);
    if (email_verified)
      // account linking is only offered verified email
      getUsersWithSameVerifiedEmail = auth0Client.getUsersWithSameVerifiedEmail(
        req.oidc.user
      );

    const [user, suggestedUsers] = await Promise.all([
      getUserProfile,
      getUsersWithSameVerifiedEmail,
    ]);

    const flashError = clear(req);
    res.render("user", {
      user,
      suggestedUsers,
      wrongAccountError: flashError && flashError === Errors.WrongAccount,
    });
  } catch (err) {
    debug("GET /user[s] failed: %o", err);
    res.render("error", err);
  }
});

module.exports = router;
