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
import { connect } from 'react-redux';
import store from '../../core/store';
import history from '../../core/history';

class Navigation extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  onClick() {
    firebase.auth().signOut();
  }


  render() {
    return (
      <nav className="mdl-navigation" ref={node => (this.root = node)}>
        <Link className="mdl-navigation__link" to="/home">Home</Link>
        <Link className="mdl-navigation__link" to="/about/56">About</Link>
        {this.props.user && <Link className="mdl-navigation__link" to="/" onClick={this.onClick}>Sign Out</Link>}
      </nav>
    );
  }

}

const mapStateToProps = function(store) {
  return {
    user: store.user
  };
}

export default connect(mapStateToProps)(Page);
