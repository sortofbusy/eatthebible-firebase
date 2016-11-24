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
    default:
      return state;
  }
});

export default store;
