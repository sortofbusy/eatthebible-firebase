import store from './store';

/*const db = firebase.database().ref('users');
const userId = firebase.auth().currentUser.uid;
const plansRef = db.child(userId).child('plans');
*/

exports.incrementPlan = function(plans, currentPlanId) {
  const userRef = firebase.database().ref('/users/' + firebase.auth().currentUser.uid);

  let plan = plans[currentPlanId];
  let newCurrentPlanId = currentPlanId;
  
  /*if (plan.cursor + 1 > plan.endChapter) {
    this.setState({open: true});
    return;
  }*/
    //increment the cursor
  let newCursor = plan.cursor + 1;
  
    // assign new values assuming chapters have been read today
  let newChaptersToday = (plan.chaptersToday) ? plan.chaptersToday + 1 : 1;
  let newLatestTimestamp = plan.latestTimestamp;
    // if not, reset counts and timestamp
  if (!exports.dateIsToday(plan.latestTimestamp)) {
    newChaptersToday = 1;
    newLatestTimestamp = Date.now();
  }
  
  // check if portion is complete
  if(newChaptersToday >= plan.pace || newCursor >= plan.endChapter) {
    // find the next unread plan
    let incompletePlan = null;
    Object.keys(plans).forEach(function(key,index) {
      if (!incompletePlan && (key !== currentPlanId) && (!plans[key].chaptersToday || plans[key].chaptersToday < plans[key].pace 
          || !exports.dateIsToday(plans[key].latestTimestamp) ) )
        incompletePlan = key;
    });
    
    // if all plans have been completed today
    if (incompletePlan === null) {
      // reset currentPlanId to the beginning
      newCurrentPlanId = Object.keys(plans)[0];              
    } else { //  otherwise, read the next unread plan 
      newCurrentPlanId = incompletePlan;
    }  
  }

  userRef.child('currentPlanId').set(newCurrentPlanId);

  userRef.child('plans').child(currentPlanId).update({
    cursor: newCursor,
    chaptersToday: newChaptersToday,
    latestTimestamp: newLatestTimestamp
  });
}

// TODO: initialize date-dependent values for each plan
exports.initializePlans = function(plans, currentPlanId) {
  if(plans) {
    const userRef = firebase.database().ref('/users/' + firebase.auth().currentUser.uid);

    let planKeys = Object.keys(plans);
    let newLatestTimestamp = Date.now();
    for (let i = 0; i < planKeys.length; i++) {
      if (!plans[planKeys[i]].latestTimestamp || !exports.dateIsToday(plans[planKeys[i]].latestTimestamp))
        userRef.child('plans').child(planKeys[i]).update({
          chaptersToday: 0,
          latestTimestamp: newLatestTimestamp
        });
    }
  }
}

exports.dateIsToday = function(timestamp) {
  if (!timestamp) return false;

  let endOfToday = new Date(Date.now());
  let startOfToday = new Date(Date.now());
  startOfToday.setHours(0,0,0,1);
  endOfToday.setHours(23,59,59,999);
  startOfToday = Date.parse(startOfToday);
  endOfToday = Date.parse(endOfToday);
  
  if (timestamp >= startOfToday && timestamp <= endOfToday) {
    return true;
  } else return false;
} 