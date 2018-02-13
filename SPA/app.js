var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
var auth0Manage;

/*
* App login using Lock
*/
function login(){

  // Instantiates Lock asking for an /api/v2 access_token 
  // to be able to read/update the user identity
  
  var opts = {
    autoclose: true,
    auth: {
      responseType: 'token id_token',
      audience: 'https://' + AUTH0_DOMAIN + '/api/v2/',
      params: {
        scope: 'openid email profile read:current_user update:current_user_identities'
      }
    }
  };

  lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts);
  lock.show();
}

/*
* App login using a one time code via SMS
*/
function loginPasswordlessSMS(){

  // Instantiates Lock Passwordless asking for an /api/v2 access_token 
  // to be able to read/update the user identity
  
  var opts =  {
    allowedConnections: ['sms'],
    autoclose: true,
    auth: {
      audience: 'https://' + AUTH0_DOMAIN + '/api/v2/',
      responseType: 'token id_token',
      params: {
        scope: 'openid email profile read:current_user update:current_user_identities'
      }
    }
  };

  lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts);
  lock.show()
}

/*
* App login using a one time code via Email
*/
function loginPasswordlessEmailCode(){

  // Instantiates Lock Passwordless asking for an /api/v2 access_token 
  // to be able to read/update the user identity
  
  var opts = {
    allowedConnections: ['email'],
    auth: {
      audience: 'https://' + AUTH0_DOMAIN + '/api/v2/',
      responseType: 'token id_token',
      allowedConnections: ['email'],
      params: {
        scope: 'openid email profile read:current_user update:current_user_identities'
      }
    },
  };
  
  lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID , AUTH0_DOMAIN, opts);
  lock.show();
}

/*
* Logout user
*/
function logout(){
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('access_token');
    $('.login-box').show();
    $('.logged-in-box').hide(); 
}

/*
* Link Accounts.
*/
function linkPasswordAccount(connection) {
  localStorage.setItem('linking','linking');
 
  // Instantiates Lock, to get an id_token that will be then used to 
  // link the account

  var opts = { 
    rememberLastLogin: false,
    auth: {
      responseType: 'token id_token',
    },
    dict: {
      signin: {
        title: 'Link another account'
      }
    }
  };
        
  if (connection) {
    opts.allowedConnections = [connection];
  }

  lock = new Auth0Lock( AUTH0_CLIENT_ID , AUTH0_DOMAIN, opts);
  lock.show();
}

/*
* Link using Passwordless SMS connection
*/
function linkPasswordlessSMS() {
  localStorage.setItem('linking','linking');

  // Instantiates LockPasswordless, to get an id_token that will be then used to 
  // link the account
  
  var opts = { 
    autoclose: true, 
    rememberLastLogin: false,
    allowedConnections: ['sms'],
    auth: {
      responseType: 'token id_token'
    },
    dict:{
      phone: {
        headerText: "Enter your phone to sign in <br>or create an account to link to."
      }
    }
  };

  var lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts);
  lock.show();
}

/*
* Link using Passwordless Email Code
*/
function linkPasswordlessEmailCode() {

  // Instantiates LockPasswordless, to get an id_token that will be then used to 
  // link the account

  localStorage.setItem('linking','linking');

  var opts = { 
    autoclose: true, 
    rememberLastLogin: false,
    allowedConnections: ['email'],
    auth: {
      responseType: 'token id_token'
    },
    dict: {
      email: {
        headerText: "Enter your email to sign in or sign up to the account to link to."
      }
    }
  };

  var lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts );
  lock.show();
}

/*
* Link using Passwordless Email Magic Link
*/
function linkPasswordlessEmailLink() {
  localStorage.setItem('linking','linking');

  // Instantiates LockPasswordless, to get an id_token that will be then used to 
  // link the account

  var opts = { 
    allowedConnections: ['email'],
    passwordlessMethod: 'link',
    auth: {
      responseType: 'token id_token'
    },
  }

  var lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID, AUTH0_DOMAIN, opts );
  lock.show();
}

function reloadProfile() {

  var access_token = localStorage.getItem('access_token');
  var id_token = localStorage.getItem('id_token');
  var user_id = localStorage.getItem('user_id');
  
  if (access_token && user_id) {
    auth0Manage = new auth0.Management({
      domain: AUTH0_DOMAIN,
      token: access_token
    });
        
    auth0Manage.getUser(user_id, function(err, profile) {
      if (!err) {
        // use userInfo
        showLoggedInUser(profile);
      }
      else {
        alert('There was an error getting user info. ' + err.description);
      }
    });
  }
}

/*
* Link account
*/
function linkAccount(secondaryIdToken) {

  // At this point you could fetch the secondary account's user_metadata for merging with the primary account.
  // Otherwise, it will be lost after linking the accounts

  // Uses the access_token of the primary user as a bearer token to identify the account
  // which will have the account linked to, and the id_token of the secondary user, to identify
  // the user that will be linked into the primary account. 

  var primaryAccessToken = localStorage.getItem('access_token');
  var primaryUserId = localStorage.getItem('user_id');

  $.ajax({
    type: 'POST',
    url: 'https://' + AUTH0_DOMAIN +'/api/v2/users/' + primaryUserId + '/identities',
    data: {
      link_with: secondaryIdToken
    },
    headers: {
      'Authorization': 'Bearer ' + primaryAccessToken
    }
  }).then(function(identities){
    alert('linked!');
    reloadProfile();
  }).fail(function(jqXHR){
    alert('Error linking Accounts: ' + jqXHR.status + " " + jqXHR.responseText);
  });
}

/*
* Unlink account
*/
function unlinkAccount(secondaryProvider, secondaryUserId) {
  var primaryUserId = localStorage.getItem('user_id');
  var primaryAccessToken = localStorage.getItem('access_token');
  
  // Uses the access_token of the primary user as a bearer token to identify the account
  // which will have the account unlinked to, and the user id of the secondary user, to identify
  // the user that will be unlinked from the primary account. 

  $.ajax({
    type: 'DELETE',
    url: 'https://' + AUTH0_DOMAIN +'/api/v2/users/' + primaryUserId +
         '/identities/' + secondaryProvider + '/' + secondaryUserId,
    headers: {
      'Authorization': 'Bearer ' + primaryAccessToken
    }
  }).then(function(identities){
    alert('unlinked!');
    showLinkedAccounts(identities);
  }).fail(function(jqXHR){
    alert('Error unlinking Accounts: ' + jqXHR.status + ' ' + jqXHR.responseText);
  });
}

/*
* Display profile properties of logged in user
*/
function showLoggedInUser(profile) {
  $('.login-box').hide();
  $('.logged-in-box').show();
  $('.nickname').text(profile.nickname);
  $('.profile').text(JSON.stringify(profile,null,2));
  $('.avatar').attr('src', profile.picture);
  showLinkedAccounts(profile.identities);
}

/*
* Returns true if the identity is the same of the root profile
*/
function isRootIdentity(identity) { 
  var user_id = localStorage.getItem('user_id');
  return identity.provider === user_id.split('|')[0] && identity.user_id === user_id.split('|')[1];
}

/*
* Handles the "authenticated" event for all Lock log-ins.
*/
function lockAuthenticated(authResult) {
    if (localStorage.getItem('linking') === 'linking') {
      // The "Link Account" method first saves the "linking" item and then authenticates
      // We identify that flow here, so after each subsequent log-in, we link the accounts
      localStorage.removeItem('linking');
      linkAccount(authResult.idToken);
    } else {
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('user_id', authResult.idTokenPayload.sub);
        reloadProfile();
    }
}

/*
* Displays Linked Accounts as table rows in UI
*/
function showLinkedAccounts(identities) {
  $('table.accounts tbody tr').remove();
  if (identities.length > 1){
    $.each(identities,function(index,identity){
      if (!isRootIdentity(identity)){
        $('table.accounts tbody').append(
          `<tr>
            <td>${identity.connection}</td>
            <td>${identity.isSocial}</td>
            <td>${identity.provider}</td>
            <td>${identity.user_id}</td>
            <td><pre>${JSON.stringify(identity.profileData,null,2)}</pre></td>
            <td><button onclick="unlinkAccount('${identity.provider}','${identity.user_id}')" class="btn btn-danger">Unlink</button></td>
          </tr>`);
      }
    });
  } else {
    $('table.accounts tbody').append('<tr><td colspan="6">No linked accounts yet...</td></tr>');
  }
}

$(document).ready(function() {
  // Listening for the authenticated event
  lock.on("authenticated", lockAuthenticated);

  // Handle case of already logged-in user
  reloadProfile();
});
