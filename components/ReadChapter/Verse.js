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
import cx from 'classnames';

class Verse extends React.Component {

  render() {
    if (!this.props.verse) return null;
    return <div key={this.props.verse.verse_nr}><sup>{this.props.verse.verse_nr}</sup> {this.props.verse.verse}</div>;
  }

}

export default Verse;