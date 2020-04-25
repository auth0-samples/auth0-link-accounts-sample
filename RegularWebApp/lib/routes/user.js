"use strict";

const debug = require("debug")("auth0-link-accounts-sample");

const router = require("express").Router();
const auth0Client = require("../Auth0Client");
const _ = require("lodash");
const { Errors, clear } = require("../flashErrors");

// const ManagementClient = require("auth0").ManagementClient;
// const management = new ManagementClient({
//   token: process.env.AUTH0_APIV2_TOKEN,
//   domain: process.env.AUTH0_DOMAIN,
// });

// const router = auth({
//   required: false,
//   appSession: false,
//   handleCallback: (req, res, next) => {
//     console.log(req.openidTokens);
//     console.log(req.openidState);
//     user = req.openidTokens.claims();
//     next();
//   },
//   // getLoginState: (req, config) => {
//   //   console.log(config);
//   //   return {
//   //     originalUser: "xxxxx",
//   //     online: false,
//   //   };
//   // },
// });

/*
 * Recursively merges user_metadata and app_metadata from secondary into primary user.
 * Data of primary user takes preponderance.
 * Array fields are joined.
 */
function _mergeMetadata(primaryUser, secondaryUser) {
  const customizerCallback = function (objectValue, sourceValue) {
    if (_.isArray(objectValue)) {
      return sourceValue.concat(objectValue);
    }
  };
  const mergedUserMetadata = _.merge(
    {},
    secondaryUser.user_metadata,
    primaryUser.user_metadata,
    customizerCallback
  );
  const mergedAppMetadata = _.merge(
    {},
    secondaryUser.app_metadata,
    primaryUser.app_metadata,
    customizerCallback
  );

  return Promise.all([
    management.users.updateUserMetadata(
      { id: primaryUser.sub },
      mergedUserMetadata
    ),
    management.users.updateAppMetadata(
      { id: primaryUser.sub },
      mergedAppMetadata
    ),
  ]).then((result) => {
    //save result in primary in session
    primaryUser.user_metadata = result[0].user_metadata;
    primaryUser.app_metadata = result[1].app_metadata;
  });
}

/* GET user profile. */
router.get("/", async (req, res) => {
  const user = req.openid.user;
  //fetch user profile containing the user_metadata and app_metadata properties
  try {
    const profile = await auth0Client.getUser(user.sub);
    const flashError = clear(req);
    res.render("user", {
      user: profile,
      wrongAccountError: flashError && flashError === Errors.WrongAccount,
    });
  } catch (err) {
    debug("GET /user failed: %o", err);
    res.render("error", err);
  }
});

router.get("/suggested-users", async (req, res) => {
  debug("GET /suggested-users ...");
  try {
    const suggestedUsers = await auth0Client.getUsersWithSameVerifiedEmail(
      req.openid.user
    );
    res.send(suggestedUsers);
  } catch (err) {
    debug("GET /user/suggested-users failed: %o", err.message);
    res.send([]);
  }
});

router.post("/link-accounts/:targetUserId", (req, res, next) => {
  // Fetch target user to make verifications and merge metadata

  Auth0Client.getUser(req.params.targetUserId)
    .then((targetUser) => {
      // verify email (this is needed because targetUserId came from client side)
      if (
        !targetUser.email_verified ||
        targetUser.email !== req.user._json.email
      ) {
        throw new Error("User not valid for linking");
      }

      //merge metadatax
      return _mergeMetadata(req.user._json, targetUser);
    })
    .then(() => {
      return Auth0Client.linkAccounts(
        req.user._json.sub,
        req.params.targetUserId
      );
    })
    .then((identities) => {
      req.user.identities = req.user._json.identities = identities;
      res.send(identities);
    })
    .catch((err) => {
      console.log("Error linking accounts!", err);
      next(err);
    });
});

router.post(
  "/unlink-accounts/:targetUserProvider/:targetUserId",
  (req, res, next) => {
    Auth0Client.unlinkAccounts(
      req.user._json.sub,
      req.params.targetUserProvider,
      req.params.targetUserId
    )
      .then((identities) => {
        req.user.identities = req.user._json.identities = identities;
        res.send(identities);
      })
      .catch((err) => {
        console.log("Error unlinking accounts!", err);
        next(err);
      });
  }
);

module.exports = router;
