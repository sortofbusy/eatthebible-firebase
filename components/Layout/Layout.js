/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import cx from 'classnames';
import Header from './Header';
import Footer from '../Footer';
import s from './Layout.css';
import history from '../../core/history';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import ActionToday from 'material-ui/svg-icons/action/today';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import CommunicationChat from 'material-ui/svg-icons/communication/chat';

require("!style!css!../../public/globals.css"); // to style the firebase-auth-ui widget

class Layout extends React.Component {

  static propTypes = {
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    let settingsStyle = {};

    if (this.props.settings) {
      let backgroundColor = '';
      let color = '';
      if (this.props.settings.colorScheme === 'sepia') {
        backgroundColor = '#FBF0D9';
        color = '#5F4B32';
      }
      settingsStyle = {
        backgroundColor: backgroundColor,
        color: color
      };
    }
    settingsStyle['flex'] = '1';
    
    return (
      <div style={settingsStyle}>
        <AppBar
          title={<span style={{cursor: 'pointer'}}>Eat the Bible</span>}
          onTitleTouchTap={() => history.push({ pathname: '/' })}
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        {firebase.auth().currentUser && 
          <Drawer
            docked={false}
            width={250}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <Header/>
            <Divider />
            <List>
              <ListItem
                leftIcon={<ActionToday/>}
                primaryText="Plans"
                onTouchTap={() => history.push({ pathname: '/plans' })}
              />
              <ListItem
                leftIcon={<CommunicationChat/>}
                primaryText="Notes"
                onTouchTap={() => history.push({ pathname: '/notes' })}
              />
              <ListItem
                leftIcon={<ActionSettings/>}
                primaryText="Settings"
                onTouchTap={() => history.push({ pathname: '/settings' })}
              />
            </List>
          </Drawer>}
          <div children={this.props.children} className={cx(s.content, this.props.className)} />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    settings: store.settings
  };
}

export default connect(mapStateToProps)(Layout);
