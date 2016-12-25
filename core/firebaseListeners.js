import React from 'react';
import store from './store';

let uid = null;
let plansRef = null;
let currentPlanIdRef = null;
let settingsRef = null;

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

    plansRef = firebase.database().ref('users').child(uid).child('settings');
    plansRef.on('value', function(snapshot) {
      store.dispatch({
          type: 'SET_SETTINGS',
          settings: snapshot.val()
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
    if (settingsRef) settingsRef.off();
  }
};