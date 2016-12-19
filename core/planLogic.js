import store from './store';

/*const db = firebase.database().ref('users');
const userId = firebase.auth().currentUser.uid;
const plansRef = db.child(userId).child('plans');
*/


exports.incrementPlan = function(plans, currentPlanId) {
  let plan = plans[currentPlanId];
  let newCurrentPlanId = currentPlanId;
  
  /*if (plan.cursor + 1 > plan.endChapter) {
    this.setState({open: true});
    return;
  }*/
    //increment the cursor
  let newCursor = plan.cursor + 1;
  
    // assign new values assuming chapters have been read today
  let newChaptersToday = plan.chaptersToday + 1;
  let newLatestTimestamp = plan.latestTimestamp;
    // if not, reset counts and timestamp
  if (!exports.dateIsToday(plan.latestTimestamp)) {
    newChaptersToday = 1;
    newLatestTimestamp = Date.now();
  }
  
  // check if portion is complete
  if(newChaptersToday + 1 >= plan.pace || newCursor >= plan.endChapter) {

    // find the next unread plan
    let incompletePlan = null;
    Object.keys(plans).forEach(function(key,index) {
      if (!incompletePlan && (!plans[key].chaptersToday || plans[key].chaptersToday < plans[key].pace )) incompletePlan = key;
    });
    
    // if all plans have been completed today
    if (incompletePlan === null) {
      // reset currentPlanId to the beginning
      newCurrentPlanId = Object.keys(plans)[0];              
    } else { //  otherwise, read the next unread plan 
      newCurrentPlanId = incompletePlan;
    }
  }

  const userRef = firebase.database().ref('/users/' + firebase.auth().currentUser.uid);

  userRef.child('currentPlanId').set(newCurrentPlanId);

  userRef.child('plans').child(currentPlanId).update({
    cursor: newCursor,
    chaptersToday: newChaptersToday,
    latestTimestamp: newLatestTimestamp
  });

  /*  plans[currentPlanId].$advance().then( function(response) {
      var plan = response;
        //check if portion is complete
      if(plan.chapters.length === plan.pace || plan.cursor >= plan.endChapter) {
        
        // check if plan is ended, resolve the plan
        if(plan.cursor > plan.endChapter) {
          resolve(plan);
          return;
        } 
        
        // otherwise, find the next unread plan
        var incompletePlan = service.incompletePlan();  
        
        // if all plans have been completed today
        if (incompletePlan === null) {
          // reset the active plan to the beginning, resolve
          planSegment = 0;
          resolve('portionRead');
          return;               
        } else { //  otherwise, read the next unread plan 
          if(incompletePlan !== null)
            planSegment = incompletePlan;
          resolve(service.beginPlanPortion());
          return;
        }


    service.incompletePlan = function() {
      for(var i = 0; i < plans.length; i++) {
        var planChaptersReadToday = plans[i].chapters ? plans[i].chapters.length : 0;
        if (planChaptersReadToday < plans[i].pace) {
          return i;
        } 
      }
      return null;
    };
*/
}

// TODO: initialize date-dependent values for each plan
exports.initializePlans = function(plans, currentPlanId) {
  if(!currentPlanId && plans)
    store.dispatch({
        type: 'SET_CURRENTPLANID',
        currentPlanId: Object.keys(plans)[0]
    });
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