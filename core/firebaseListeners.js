import React from 'react';
import store from './store';

let uid = null;
let plansRef = null;
let currentPlanIdRef = null;
let settingsRef = null;
let notesRef = null;
let notesByChapterRef = null;

let currentChapterId = null;

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

    settingsRef = firebase.database().ref('users').child(uid).child('settings');
    settingsRef.on('value', function(snapshot) {
      store.dispatch({
          type: 'SET_SETTINGS',
          settings: snapshot.val()
      });
    });

    notesRef = firebase.database().ref('users').child(uid).child('notes');
    notesRef.on('value', function(snapshot) {
      store.dispatch({
          type: 'SET_NOTES',
          notes: snapshot.val()
      });
    });

    // store.subscribe to plans, currentPlanId, then use orderby, startat, endat to limit notes.
    notesByChapterRef = firebase.database().ref('users').child(uid).child('notesByChapter');
    store.subscribe(listenToStore);
    
  } else { // if the user has signed out, remove all listeners
    if (plansRef) plansRef.off();
    if (currentPlanIdRef) currentPlanIdRef.off();
    if (settingsRef) settingsRef.off();
    if (notesRef) notesRef.off();
    if (notesByChapterRef) notesByChapterRef.off();
  }
};

function listenToStore() {
  let previousChapterId = currentChapterId;

  let state = store.getState();
  if (state.plans && state.currentPlanId) {
    currentChapterId = state.plans[state.currentPlanId].cursor;
    
    if (previousChapterId !== currentChapterId) {
      notesByChapterRef.child(currentChapterId).on('value', function(snapshot) {
        store.dispatch({
            type: 'SET_NOTESBYCHAPTER',
            notesByChapter: snapshot.val()
        });
      });
    }
  }
}