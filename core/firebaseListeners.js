import React from 'react';
import store from './store';

let uid = null;
let plansRef = null;
let currentPlanIdRef = null;

exports.firebaseListen = (user) => {
  if (user) { // if the user is signed in, add firebase listeners
    uid = firebase.auth().currentUser.uid;
    
    plansRef = firebase.database().ref('users').child(uid).child('plans');
    plansRef.on('value', function(snapshot) {
      store.dispatch({
          type: 'PLANS',
          plans: snapshot.val()
      });
    });

    currentPlanIdRef = firebase.database().ref('users').child(uid).child('currentPlanId');
    currentPlanIdRef.on('value', function(snapshot) {
      store.dispatch({
          type: 'SET_CURRENTPLANID',
          currentPlanId: snapshot.val()
      });
    });
  } else { // if the user has signed out, remove all listeners
    if (plansRef) plansRef.off();
    if (currentPlanIdRef) currentPlanIdRef.off();
  }
};