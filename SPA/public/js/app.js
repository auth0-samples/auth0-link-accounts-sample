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
      `Account linking is only allowed to verified account. Please verify your email ${email}.`
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
  try {
    await auth0.getTokenSilently();
  } catch {}

  // If unable to parse the history hash, default to the root URL
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
    showContentFromUrl("/profile");
    return;
  }

  console.log("> User not authenticated");

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }

      console.log("Logged in!");
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }

    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
};
