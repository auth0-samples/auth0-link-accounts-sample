var lock = new Auth0Lock(
  // All these properties are set in auth0-variables.js
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN
);

/*
* App login using Lock in Redirect Mode
*/
function login(){
  lock.show();
}

/*
* Logout user
*/
function logout(){
  $.ajax({
    type: 'GET',
    url: `https://${AUTH0_DOMAIN}/v2/logout`
  }).then(function(data){
    localStorage.removeItem("id_token");
    localStorage.removeItem("profile");
    localStorage.removeItem("access_token");
    $('.login-box').show();
    $('.logged-in-box').hide(); 
  }).fail(function(err){
    alert('error'+err);
  });
}


/*
* Link Accounts.
*/
function linkAccount(connection){
  var opts = {
    rememberLastLogin: false,
    dict: {
      signin: {
        title: 'Link another account'
      }
    },
    authParams: {
      access_token: localStorage.getItem('access_token')
    }
  };
  if (connection){
    opts.connections = [connection];
  }
  lock.showSignin(opts,function(err,profile){
    if (err){
      alert('Error linking account! ' + err );
      console.log('Error linking account',err,err.stack);
      return;
    }
    console.log('profile',profile);
    showLoggedInUser(profile);
  });
}

/*
* Link using Passwordless SMS connection
*/
function linkPasswordlessSMS(){
  // Initialize Passwordless Lock instance
  var lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID, AUTH0_DOMAIN );

  // Open the lock in SMS mode with the ability to handle the authentication in page
  lock.sms(function (err, profile, id_token) {
    if (!err){
      // Save the JWT token.
      console.log('sms profile', profile);
      console.log('sms id_token', id_token);
    }
  });
}

/*
* Link using Passwordless Email Code
*/
function linkPasswordlessEmailCode(){
  // Initialize Passwordless Lock instance
  var lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID, AUTH0_DOMAIN );

  // Open the lock in Email Code mode with the ability to handle
  // the authentication in page
  lock.emailcode( function(err, profile, id_token) {
    if (!err) {
      console.log('email profile',profile);
      console.log('email id_token',id_token);
    }
  });
}

/*
* Link using Passwordless Email Magic Link
*/
function linkPasswordlessEmailLink(){
  // Initialize Passwordless Lock instance
  var lock = new Auth0LockPasswordless( AUTH0_CLIENT_ID, AUTH0_DOMAIN );

  // Open the lock in Email Code mode with the ability to handle
  // the authentication in page
  lock.magiclink();
}

/*
* Unlink account
*/
function unlinkAccount(provider,userId){
  var accessToken = localStorage.getItem("access_token");
  var data={
    access_token: accessToken,
    user_id: provider+'|'+userId
  };
  $.ajax({
    type: 'POST',
    url: `https://${AUTH0_DOMAIN}/unlink`,
    data: data
  }).then(function(data){
    alert("unlinked! "+data);
  }).fail(function(err){
    alert('error: ' + err.error + " " + err.error_description);
  });
}

/*
* Display profile properties of logged in user
*/
function showLoggedInUser(profile){
  $('.login-box').hide();
  $('.logged-in-box').show();
  $('.nickname').text(profile.nickname);
  $('.profile').text(JSON.stringify(profile,null,2));
  $('.avatar').attr('src', profile.picture);
  showLinkedAccounts(profile);
}

/*
* Returns true if the identity is the same of the root profile
*/
function isRootIdentity(identity){
  var profile = JSON.parse(localStorage.getItem('profile'));
  return identity.provider === profile.user_id.split('|')[0] && identity.user_id === profile.user_id.split('|')[1];
}

/*
* Displays Linked Accounts as table rows in UI
*/
function showLinkedAccounts(profile){
  if (profile.identities.length > 1){

    $('table.accounts tbody tr').remove();

    $.each(profile.identities,function(index,identity){
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
  }
}

$(document).ready(function() {
  //handle redirection from iDP after login
  //TODO: handle the case of linking with magic link
  var hash = lock.parseHash();
  if (hash) {
    window.location.hash = ''; //clean hash
    console.log('hash',hash);
    if (hash.error) {
      alert('There was an error logging in ' + hash.error );
    } else {
      lock.getProfile(hash.id_token, function(err, profile) {
        if (err) {
          alert('There was an error logging in. ' + err);
        } else {
          // Save the JWT token.
          localStorage.setItem('id_token', hash.id_token);
          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('access_token', hash.access_token);
          showLoggedInUser(profile);
        }
      });
    }
  }
  //handle case of page refreshed with a user already logged-in
  else {
    var profile = localStorage.getItem('profile');
    if (profile !== null){
      showLoggedInUser(JSON.parse(profile));
    }
  }

});
