/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

const Footer = (props) => (
  <footer style={{textAlign: 'center', backgroundColor: props.muiTheme.palette.accent1Color, height: 36, paddingTop: 20}}>
    <div style={{textAlign: 'left', maxWidth: 1000, margin: 'auto', color: 'white', paddingLeft: 8}}>
      <div>© Eat the Bible</div>
    </div>
  </footer>
);


export default muiThemeable()(Footer);
