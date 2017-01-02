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
import history from '../../core/history';
import s from './Header.css';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class Header extends React.Component {
  
  state = {
    open: false,
    user: firebase.auth().currentUser
  };

  signOut() {
    firebase.auth().signOut();
    history.push({ pathname: '/welcome' });
  }

  render() {
    if (!this.state.user) return null;
    else return (
      <div style={{backgroundImage: "url('../../banner.jpg')", backgroundSize: 'cover'}} className={s.header}>
        <img className={s.image} src={this.state.user.photoURL} height="60" width="60"/>
        <List>  
          <ListItem
            primaryText={this.state.user.displayName}
            secondaryText={this.state.user.email}
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem
                key={1}
                primaryText="SIGN OUT"
                onTouchTap={this.signOut}
              />
            ]}
          />
        </List>
      </div>
    );
  }

}

export default Header;
