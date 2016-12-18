import React from 'react';
import store from './store';

let uid = null;
let plansRef = null;

exports.firebaseListen = (user) => {
  if (user) { // if the user is signed in, add firebase listeners
    uid = firebase.auth().currentUser.uid;
    
    plansRef = firebase.database().ref('users/' + uid + '/plans');
    plansRef.on('value', function(snapshot) {
      store.dispatch({
          type: 'PLANS',
          plans: snapshot.val()
      });
    });
  } else { // if the user has signed out, remove all listeners
    if (plansRef) plansRef.off();
  }
};