import React from 'react';
import store from './store';
import history from './history';
import {firebaseListen}  from './firebaseListeners';

// FirebaseUI config.
exports.uiConfig = {
  'callbacks': {
    // Called when the user has been successfully signed in.
    'signInSuccess': function(user, credential, redirectUrl) {
      let userId = user.uid;
      firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        if (snapshot.val() === null) {
          firebase.database().ref('/users/' + userId).update({
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            settings: {
              version: { language: 'English', name: 'American Standard Version', code: 'asv'},
              textSize: 1,
              notifications: false,
              colorScheme: 'normal'
            }
          });
        }
        // ...
      });

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

  firebase.auth().onAuthStateChanged(function(user) {
		store.dispatch({
		  	type: 'USER',
		  	user: user
		});
    firebaseListen(user);
	}, function(error) {
		console.log(error);
	});
};