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
import Paper from 'material-ui/Paper';
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

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {

    let w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

    this.setState({width: width, height: height});
  };



  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    let settingsStyle = {};

    if (this.props.settings) {
      let backgroundColor = '';
      let color = '';
      if (this.props.settings.colorScheme === 'sepia' && this.props.reading) {
        backgroundColor = '#FBF0D9';
        color = '#5F4B32';
      }
      settingsStyle = {
        backgroundColor: backgroundColor,
        color: color
      };
    }
    settingsStyle['flex'] = '1';
    
    let windowIsSmall = (drawerWidth >= (this.state.width - contentWidth - 32) / 2);

    let appBarStyle = {display: 'block'};
    if (!windowIsSmall) appBarStyle = {display: 'none'};

    return (
      <div style={settingsStyle}>
        {!firebase.auth().currentUser && 
          <AppBar
            title={'Eat the Bible'}
            iconStyleLeft={{display: 'none'}}
          />
        }
        {firebase.auth().currentUser && 
          <AppBar
            title={<span style={{cursor: 'pointer'}}>Eat the Bible</span>}
            onTitleTouchTap={() => history.push({ pathname: '/' })}
            iconStyleLeft={appBarStyle}
            onLeftIconButtonTouchTap={this.handleToggle}
          />
        }
        {firebase.auth().currentUser && !windowIsSmall && //content width plus drawer width
          <Paper
            style={{position: 'absolute', x: 16, y: 16, width: drawerWidth}}
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
          </Paper>
        }
        {firebase.auth().currentUser && windowIsSmall &&
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
          </Drawer>
        }
          <div className={cx(s.content, this.props.className)} >
            {this.props.children}
          </div>
      </div>
    );
  }
}

const contentWidth = 800;
const drawerWidth = 250;

const mapStateToProps = function(store) {
  return {
    settings: store.settings
  };
}

export default connect(mapStateToProps)(Layout);
