import React from 'react';
import store from './store';
import history from './history';


// FirebaseUI config.
exports.uiConfig = {
  'callbacks': {
    // Called when the user has been successfully signed in.
    'signInSuccess': function(user, credential, redirectUrl) {
      history.push({ pathname: '/' });
      // Do not redirect.
      return false;
    }
  },
  'signInOptions': [
    // TODO(developer): Remove the providers you don't need for your app.
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ['https://www.googleapis.com/auth/plus.login']
    },
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes :[
        'public_profile',
        'email'
      ]
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  'tosUrl': ''
};

exports.AuthUI = new firebaseui.auth.AuthUI(firebase.auth());

exports.initFirebase = () => {
  let currentUser = firebase.auth().currentUser;
  //console.log(currentUser);
  if (currentUser) {
  	store.dispatch({
	  	type: 'USER',
	  	user: currentUser
	});
  }

  firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	  // User is signed in.
	  var displayName = user.displayName;
	  var email = user.email;
	  var emailVerified = user.emailVerified;
	  var photoURL = user.photoURL;
	  var uid = user.uid;
	  var providerData = user.providerData;
	  /*user.getToken().then(function(accessToken) {
	    document.getElementById('account-details').textContent = JSON.stringify({
	      displayName: displayName,
	      email: email,
	      emailVerified: emailVerified,
	      photoURL: photoURL,
	      uid: uid,
	      accessToken: accessToken,
	      providerData: providerData
	    }, null, '  ');
	  });*/

	} else {
		//exports.AuthUI.start('#firebaseui-auth-container', uiConfig);
	  // User is signed out.
	  //document.getElementById('account-details').textContent = 'null';
	}
	store.dispatch({
	  	type: 'USER',
	  	user: user
	});

	}, function(error) {
		console.log(error);
	});
};