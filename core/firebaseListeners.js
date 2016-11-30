import React from 'react';
import store from './store';

exports.firebaseListen = () => {
  let uid = firebase.auth().currentUser.uid;
  var plansRef = firebase.database().ref('users/' + uid + '/plans');
  
  plansRef.on('value', function(snapshot) {
    store.dispatch({
        type: 'PLANS',
        plans: snapshot.val()
    });
  });
};