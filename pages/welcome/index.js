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
import Layout from '../../components/Layout';
import s from './styles.css';
import { connect } from 'react-redux';
import store from '../../core/store';
import history from '../../core/history';
import { AuthUI, uiConfig } from '../../core/auth';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import RaisedButton from 'material-ui/RaisedButton';
import BannerImg from '../../public/banner.png';

class WelcomePage extends React.Component {

  componentDidMount() {
    if(!this.props.user) AuthUI.start('#firebaseui-auth-container', uiConfig);
    else history.push({ pathname: '/' });
  }

  componentWillUnmount() {
    AuthUI.reset();
  }

  render() {
    return (
      <div>
        <AppBar
          title={'Eat the Bible'}
          iconStyleLeft={{display: 'none'}}
        />
        <div style={{backgroundImage: "url('../../banner.png')"}} className={s.banner}>
          <h1>EAT THE BIBLE</h1>
          <h2>a simple site to help you read the Bible every day</h2>
        </div>
        <Paper style={{padding: 16}} zDepth={2}>
          <div className={s.firebaseUiAuth} id="firebaseui-auth-container"></div>
        </Paper>
        <div id="features" style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
          <Paper style={featuresStyle}>
            <h3>Flexible</h3>
            <p>Read multiple portions of the Bible, different translations, even different languages</p><br />
          </Paper>
          <Paper style={featuresStyle}>
            <h3>Customizable</h3>
            <p>Choose from 49 Bible translations in 34 languages</p><br/>
          </Paper>
          <Paper style={featuresStyle}>
            <h3>Simple</h3>
            <p>Minimal interface for distraction-free reading</p><br/>
          </Paper>
        </div>
      </div>
    );
    
  }

}

const featuresStyle = {
  height: 200,
  width: 200,
  margin: 16,
  marginTop: 32,
  padding: 8,
  textAlign: 'center'
};

export default WelcomePage;
