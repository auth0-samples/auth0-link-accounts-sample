// The Auth0 client, initialized in configureClient()
let auth0 = null;
let config = null;

/**
 * Starts the authentication flow
 */
const login = async () => {
  try {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin,
    });
  } catch (err) {
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
const logout = () => {
  try {
    auth0.logout({
      returnTo: window.location.origin,
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config.json");

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

const authenticateUser = async () => {
  const a0 = new Auth0Client({
    domain: config.domain,
    client_id: config.clientId,
  });
  await a0.loginWithPopup({
    max_age: 0,
    scope: "openid",
  });
  return await a0.getIdTokenClaims();
};

const linkAccount = async () => {
  const accessToken = await auth0.getTokenSilently();
  const { sub } = await auth0.getUser();
  const {
    __raw: targetUserIdToken,
    email_verified,
    email,
  } = await authenticateUser();

  if (!email_verified) {
    throw new Error(
      `Account linking is only allowed to a verified account. Please verify your email ${email}.`
    );
  }

  await fetch(`https://${config.domain}/api/v2/users/${sub}/identities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      link_with: targetUserIdToken,
    }),
  });
};

const unlinkAccount = async (secondaryIdentity) => {
  const { provider, user_id } = secondaryIdentity;
  const accessToken = await auth0.getTokenSilently();
  const { sub } = await auth0.getUser();
  await fetch(
    `https://${config.domain}/api/v2/users/${sub}/identities/${provider}/${user_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

const getUserProfile = async (userId) => {
  const token = await auth0.getTokenSilently();
  const response = await fetch(
    `https://${config.domain}/api/v2/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
};

// Will run when page finishes loading
window.onload = async () => {
  const response = await fetchAuthConfig();
  config = await response.json();
  auth0 = new Auth0Client({
    domain: config.domain,
    client_id: config.clientId,
    audience: `https://${config.domain}/api/v2/`,
    scope:
      "openid email profile read:current_user update:current_user_identities",
  });

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");
  if (shouldParseResult) {
    try {
      const result = await auth0.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
        window.history.replaceState(
          {},
          document.title,
          result.appState.targetUrl
        );
      }

      //check silent authentication
      try {
        await auth0.getTokenSilently({ ignoreCache: true });
      } catch ({ error }) {
        if (error === "login_required") {
          console.warn(`Silent authentication failed with *login_required* error. This is possibly due to 3rd party cookies blocked in the browser. 
          Considering using a custom domain or refresh_token mode of the SDK. https://github.com/auth0/auth0-spa-js#refresh-token-fallback`);
        }
      }
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }
  }

  try {
    await auth0.getTokenSilently();
  } catch {}

  await updateUI();

  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    window.history.replaceState({ url: "/profile" }, {}, "/profile");
    showContentFromUrl("/profile");
  } else {
    window.history.replaceState({ url: "/" }, {}, "/");
    showContentFromUrl("/");
  }
};
