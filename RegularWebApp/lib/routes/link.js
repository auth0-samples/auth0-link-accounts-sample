const _ = require("lodash");
const debug = require("debug")("auth0-link-accounts-sample");
const { auth } = require("express-openid-connect");
const jwt_decode = require("jwt-decode");
const { Errors, set } = require("../flashErrors");
const auth0Client = require("../Auth0Client");

 const router = auth({
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL + "/link",
    clientID: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    idpLogout: true,
    afterCallback: saveLinkSession,
    authRequired: false,
    routes: {
      login: '/login',
      login: '/logout',
      callback: '/linkCallback',
    },
    session: {
      name: "linker",
    },
  }
);

router.post("/", (req, res) => {
  const { connection, email, userid } = req.body;
  // save userid in session.
  req.appSession.linking = { targetUserId: userid };

  const authorizationParams = {
    max_age: 0,
    login_hint: email,
    connection: connection,
    scope: 'openid profile email admin:user',
  };
  // Passwordless connection doesn't work with connection param.
  if (["email", "sms"].includes(authorizationParams.connection))
    delete authorizationParams.connection;
  // [re]-authenticate target account before account linking

  res.oidc.login({
    returnTo: "linkAccount",
    authorizationParams,
  });
});

router.post("/delete", async (req, res) => {
  const mainAccClaims =  jwt_decode(req.appSession.id_token);
  const { provider, userId } = req.body;
  const { sub } = mainAccClaims;
  try {
    await auth0Client.unlinkAccounts(sub, provider, userId);
  } catch (err) {
    debug("unlinkAccounts failed: %o", err);
  } finally {
    res.redirect("/user");
  }
});

router.get("/linkAccount", async (req, res) => {
  const {
    linking: { targetUserId },
  } = req.appSession;

  const { sub: authenticatedTargetUserId } = req.linker.linkTempClaims;
  if (authenticatedTargetUserId !== targetUserId) {
    debug(
      "Skipping account linking as the authenticated user(%s) is different than target linking user (%s)",
      authenticatedTargetUserId,
      targetUserId
    );
    res.redirect("/user");
    return false;
  }
  debug(
    "User %s succesfully authenticated. Account linking with %s... ",
    authenticatedTargetUserId,
    targetUserId
  );
  const mainAccClaims = jwt_decode(req.appSession.id_token);
  const { id_token: targetIdToken } = req.linker;
  const { sub: primaryUserId } = mainAccClaims;
  try {
    await mergeMetadata(primaryUserId, authenticatedTargetUserId);
    await auth0Client.linkAccounts(primaryUserId, targetIdToken);
    debug("Accounts linked.");
  } catch (err) {
    debug("Linking failed %o", err);
  }
  res.redirect('/user');
});

/*
 * Recursively merges user_metadata and app_metadata from secondary into primary user.
 * Data of primary user takes preponderance.
 * Array fields are joined.
 */
async function mergeMetadata(primaryUserId, secondaryUserId) {
  // load both users with metedata.
  const [primaryUser, secondaryUser] = await Promise.all(
    [primaryUserId, secondaryUserId].map((uid) => auth0Client.getUser(uid))
  );

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
  await auth0Client.updateUser(primaryUserId, {
    user_metadata: mergedUserMetadata,
    app_metadata: mergedAppMetadata,
  });
}

async function saveLinkSession(req, res, session, decodedState) {
      const linkTempClaims = jwt_decode(session.id_token);
      // req.linker.LinkTempClaims = linkTempClaims;
      return {
         ...session,
         linkTempClaims // access using `req.appSession.linkTempClaims`
      };
}

module.exports = router;
