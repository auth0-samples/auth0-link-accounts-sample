var lock = newLock({
  oidcConformant: true,
  auth: {
    responseType: "token id_token",
    params: {
      scope: "openid profile"
    }
  },
  overrides: {
    __useCrossAuth: true
  }
});

function newLock(opts) {
  return new Auth0Lock(
    // All these properties are set in auth0-variables.js
    AUTH0_CLIENT_ID,
    AUTH0_DOMAIN,
    opts
  );
}

/*
* App login using Lock in Redirect Mode
*/
function login() {
  lock.show();
}

/*
* App login using a one time code via SMS
*/
function loginPasswordlessSMS() {
  // Initialize Passwordless Lock instance
  var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    oidcConformant: true,
    allowedConnections: ["sms"],
    auth: {
      responseType: "token id_token",
      params: {
        scope: "openid profile"
      }
    }
  });
  lock.show();
}

/*
* App using a one time code via Email
*/
function loginPasswordlessEmailCode() {
  // Initialize Passwordless Lock instance
  var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    oidcConformant: true,
    passwordlessMethod: "code",
    auth: {
      responseType: "token id_token",
      params: {
        scope: "openid profile"
      }
    }
  });
  lock.show();
}

/*
* Logout user
*/
function logout() {
  $.ajax({
    type: "GET",
    url: "https://" + AUTH0_DOMAIN + "/v2/logout"
  })
    .then(function(data) {
      localStorage.removeItem("id_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("access_token");
      $(".login-box").show();
      $(".logged-in-box").hide();
    })
    .fail(function(err) {
      alert("error" + err);
    });
}

/*
* Link Accounts.
*/
function linkPasswordAccount(connection) {
  localStorage.setItem("linking", "linking");

  var opts = {
    oidcConformant: true,
    auth: {
      responseType: "token id_token"
    },
    overrides: {
      __useCrossAuth: true
    },
    languageDictionary: {
      title: "Link another account"
    }
  };

  if (connection) {
    opts.allowedConnections = [connection];
  }

  //open lock in signin mode, with the customized options for linking
  lock = newLock(opts);
  lock.show();
}

/*
* Link using Passwordless SMS connection
*/
function linkPasswordlessSMS() {
  localStorage.setItem("linking", "linking");
  // Initialize Passwordless Lock instance
  var opts = {
    oidcConformant: true,
    autoclose: true,
    allowedConnections: ["sms"],
    auth: {
      responseType: "token id_token"
    },
    languageDictionary: {
      passwordlessSMSInstructions: "Enter your phone to sign in <br>or create an account to link to."
    }
  };
  var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts);
  lock.show();
}

/*
* Link using Passwordless Email Code
*/
function linkPasswordlessEmailCode() {
  localStorage.setItem("linking", "linking");
  // Initialize Passwordless Lock instance
  var opts = {
    oidcConformant: true,
    autoclose: true,
    passwordlessMethod: "code",
    auth: {
      responseType: "token id_token"
    },
    languageDictionary: {
      passwordlessSMSInstructions: "Enter your email to sign in or sign up to the account to link to."
    }
  };
  var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts);
  lock.show();
}

/*
* Link using Passwordless Email Magic Link
*/
function linkPasswordlessEmailLink() {
  localStorage.setItem("linking", "linking");
  // Initialize Passwordless Lock instance
  var opts = {
    oidcConformant: true,
    autoclose: true,
    allowedConnections: ["email"],
    passwordlessMethod: "link",
    auth: {
      responseType: "token id_token"
    },
    languageDictionary: {
      passwordlessSMSInstructions: "Enter your email to sign in or sign up to the account to link to."
    }
  };
  var lock = new Auth0LockPasswordless(AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts);
  lock.show();
}

function reloadProfile() {
  lock.getUserInfo(localStorage.getItem("access_token"), function(
    error,
    profile
  ) {
    if (error) {
      alert("There was an error getting user info. " + error);
    } else {
      showLoggedInUser(profile);
    }
  });
}

/*
* Link account
*/
function linkAccount(secondaryJWT) {
  // At this point you could fetch the secondary account's user_metadata for merging with the primary account.
  // Otherwise, it will be lost after linking the accounts
  var primaryJWT = localStorage.getItem("id_token");
  var primaryUserId = localStorage.getItem("user_id");
  $.ajax({
    type: "POST",
    url:
      "https://" +
      AUTH0_DOMAIN +
      "/api/v2/users/" +
      primaryUserId +
      "/identities",
    data: {
      link_with: secondaryJWT
    },
    headers: {
      Authorization: "Bearer " + primaryJWT
    }
  })
    .then(function(identities) {
      alert("linked!");
      reloadProfile();
    })
    .fail(function(jqXHR) {
      alert(
        "Error linking Accounts: " + jqXHR.status + " " + jqXHR.responseText
      );
    });
}

/*
* Unlink account
*/
function unlinkAccount(secondaryProvider, secondaryUserId) {
  var primaryUserId = localStorage.getItem("user_id");
  var primaryJWT = localStorage.getItem("id_token");
  $.ajax({
    type: "DELETE",
    url:
      "https://" +
      AUTH0_DOMAIN +
      "/api/v2/users/" +
      primaryUserId +
      "/identities/" +
      secondaryProvider +
      "/" +
      secondaryUserId,
    headers: {
      Authorization: "Bearer " + primaryJWT
    }
  })
    .then(function(identities) {
      alert("unlinked!");
      showLinkedAccounts(identities);
    })
    .fail(function(jqXHR) {
      alert(
        "Error unlinking Accounts: " + jqXHR.status + " " + jqXHR.responseText
      );
    });
}

/*
* Display profile properties of logged in user
*/
function showLoggedInUser(profile) {
  $(".login-box").hide();
  $(".logged-in-box").show();
  $(".nickname").text(profile.nickname);
  $(".profile").text(JSON.stringify(profile, null, 2));
  $(".avatar").attr("src", profile.picture);
  showLinkedAccounts(profile.identities);
}

/*
* Returns true if the identity is the same of the root profile
*/
function isRootIdentity(identity) {
  var user_id = localStorage.getItem("user_id");
  return (
    identity.provider === user_id.split("|")[0] &&
    identity.user_id === user_id.split("|")[1]
  );
}

/*
* Handles the "authenticated" event for all Lock log-ins.
*/
function lockAuthenticated(authResult) {
  if (localStorage.getItem("linking") === "linking") {
    console.log(authResult);
    // The "Link Account" method first saves the "linking" item and then authenticates
    // We identify that flow here, so after each subsequent log-in, we link the accounts
    localStorage.removeItem("linking");
    linkAccount(authResult.idToken, authResult.idTokenPayload.sub);
  } else {
    lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) {
        alert("There was an error getting user info. " + error);
        return;
      }

      localStorage.setItem("access_token", authResult.accessToken);
      localStorage.setItem("id_token", authResult.idToken);
      localStorage.setItem("user_id", profile.user_id);
      showLoggedInUser(profile);
    });
  }
}

/*
* Displays Linked Accounts as table rows in UI
*/
function showLinkedAccounts(identities) {
  $("table.accounts tbody tr").remove();
  if (identities.length > 1) {
    $.each(identities, function(index, identity) {
      if (!isRootIdentity(identity)) {
        $("table.accounts tbody").append(
          `<tr>
            <td>${identity.connection}</td>
            <td>${identity.isSocial}</td>
            <td>${identity.provider}</td>
            <td>${identity.user_id}</td>
            <td><pre>${JSON.stringify(identity.profileData, null, 2)}</pre></td>
            <td><button onclick="unlinkAccount('${identity.provider}','${identity.user_id}')" class="btn btn-danger">Unlink</button></td>
          </tr>`
        );
      }
    });
  } else {
    $("table.accounts tbody").append(
      '<tr><td colspan="6">No linked accounts yet...</td></tr>'
    );
  }
}

$(document).ready(function() {
  // Listening for the authenticated event
  lock.on("authenticated", lockAuthenticated);

  // Handle case of already logged-in user
  if (localStorage.getItem("id_token") !== null) {
    reloadProfile();
  }
});
