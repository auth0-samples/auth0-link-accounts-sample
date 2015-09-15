$(document).ready(function() {
    var lock = new Auth0Lock(
      // All these properties are set in auth0-variables.js
      AUTH0_CLIENT_ID,
      AUTH0_DOMAIN
    );

    var userProfile;
    var accessToken;

    $('.btn-login').click(function(e) {
      e.preventDefault();
      lock.show(function(err, profile, token, access_token) {
        if (err) {
          // Error callback
          console.log("There was an error");
          alert("There was an error logging in");
        } else {
          // Success calback

          // Save the JWT token.
          localStorage.setItem('userToken', token);

          // Save the profile
          userProfile = profile;
          accessToken = access_token;

          $('.login-box').hide();
          $('.logged-in-box').show();
          $('.nickname').text(profile.nickname);
          $('.nickname').text(profile.name);
          $('.avatar').attr('src', profile.picture);
          mapLinkedAccounts(profile);
        }
      });
    });

    $('.btn-link').click(function(e) {
      e.preventDefault();

      lock.showSignin({
        rememberLastLogin: false,
        dict: {
          signin: {
            title: 'Link another account'
          }
        },
        authParams: {
          access_token: accessToken
        }
      },function(err,profile){
          if (err){
            alert("Error linking account! "+err );
            console.log("Error linking account",err,err.stack);
            return;
          }
          $('.login-box').hide();
          $('.logged-in-box').show();
          mapLinkedAccounts(profile);
      })
    });

    function mapLinkedAccounts(profile){
      $('table.accounts tbody tr').remove();
      $.each(profile.identities,function(index,identity){
        $('table.accounts tbody').append('<tr><td>'+identity.connection+
          '</td><td>'+identity.isSocial+'</td><td>'+
          identity.provider+'</td><td>'+identity.user_id+'</td><td>'+JSON.stringify(identity.profileData)+'</td></tr>');
      });
    }

    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
                'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });

    $('.btn-api').click(function(e) {
      // Just call your API here. The header will be sent
      $.ajax({
        url: 'http://localhost:3001/secured/ping',
        method: 'GET'
      }).then(function(data, textStatus, jqXHR) {
        alert("The request to the secured enpoint was successfull");
      }, function() {
        alert("You need to download the server seed and start it to call this API");
      });
    });


});
