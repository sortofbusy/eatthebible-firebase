/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {amber500, amber600, amber700, brown500} from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';

import FastClick from 'fastclick';
import { Provider } from 'react-redux';

import store from './core/store';
import router from './core/router';
import history from './core/history';
import {initFirebase}  from './core/auth';
import {firebaseListen}  from './core/firebaseListeners';

let routes = require('./routes.json'); // Loaded with utils/routes-loader.js
const container = document.getElementById('container');

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: amber600,
    primary2Color: amber700,
    primary3Color: amber500,
    accent1Color: brown500,
    accent2Color: brown500,
    accent3Color: brown500,
  },
  appBar: {
    height: 50,
  },
});


function renderComponent(component) {
  ReactDOM.render(
  	<MuiThemeProvider muiTheme={muiTheme}>
	  	<Provider store={store}>
	  		{component}
	  	</Provider>
	</MuiThemeProvider>, container);
}

// Find and render a web page matching the current URL path,
// if such page is not found then render an error page (see routes.json, core/router.js)
function render(location) {
  router.resolve(routes, location)
    .then(renderComponent)
    .catch(error => router.resolve(routes, { ...location, error }).then(renderComponent));
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/ReactJSTraining/history/tree/master/docs#readme
history.listen(render);
render(history.getCurrentLocation());

// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick
FastClick.attach(document.body);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./routes.json', () => {
    routes = require('./routes.json'); // eslint-disable-line global-require
    render(history.getCurrentLocation());
  });
}

//init Firebase Auth
window.addEventListener('load', initFirebase);
window.addEventListener('load', firebaseListen);
