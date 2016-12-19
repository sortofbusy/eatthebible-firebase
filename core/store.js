/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore } from 'redux';

// Centralized application state
// For more information visit http://redux.js.org/
const store = createStore((state, action) => {
  if (state === undefined) {
    state = {};
  }
  switch (action.type) {
    case 'USER':
      return Object.assign({}, state, { user: action.user });
    case 'PLANS':
      return Object.assign({}, state, { plans: action.plans });
    case 'SET_CURRENTPLANID':
      return Object.assign({}, state, { currentPlanId: action.currentPlanId });
    case 'TOGGLE_ISLOADING':
      if (action.errorMsg) return Object.assign({}, state, { isLoading: false, verses: {}, errorMsg: action.errorMsg });
      else if (action.verses) return Object.assign({}, state, { isLoading: false, verses: action.verses, errorMsg: null });
      else return Object.assign({}, state, { isLoading: action.isLoading });
    default:
      return state;
  }
});

export default store;
