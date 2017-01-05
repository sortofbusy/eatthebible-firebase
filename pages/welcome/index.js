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
import DeviceDevices from 'material-ui/svg-icons/device/devices';
import ActionTranslate from 'material-ui/svg-icons/action/translate';
import SocialPoll from 'material-ui/svg-icons/social/poll';
import TitleImage from './../../public/eatthebible.png';

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
        <div style={{textAlign: 'center'}}>
          <div style={{backgroundImage: "url('../../banner.png')"}} className={s.banner}>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} className={s.bannerSContent, s.bannerLContent}>
              <div style={{width: 300, marginTop: 8}}>
                <img src="../../eatthebible.png" width="300"/>
              </div>
              <Paper style={{padding: 16, width: 300, height: 224, marginBottom: 16}} zDepth={1}>
                <div className={s.firebaseUiAuth} id="firebaseui-auth-container"></div>
              </Paper>  
            </div>
          </div>
          <div className={s.hideWhenSmall} style={{marginTop: 32}}> 
            <h3>Daily Bible reading made simple</h3>
          </div>
          <div id="features" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center'}}>
            <Paper style={featuresStyle}>
              <DeviceDevices style={iconStyle}/>
              <h3 style={featureTitleStyle}>Simple</h3>
              <p>Optimized for reading on your phone</p><br/>
            </Paper>
            <Paper style={featuresStyle}>
              <ActionTranslate style={iconStyle}/>
              <h3 style={featureTitleStyle}>Customizable</h3>
              <p>Choose from 49 Bible translations in 34 languages</p><br/>
            </Paper>
            <Paper style={featuresStyle}>
              <SocialPoll style={iconStyle}/>
              <h3 style={featureTitleStyle}>Flexible</h3>
              <p>Set simultaneous reading plans and track your progress</p><br />
            </Paper>
          </div>
        </div>
      </div>
    );
    
  }

}

const featuresStyle = {
  height: 220,
  width: 250,
  margin: 16,
  marginTop: 32,
  padding: 12,
  paddingTop: 32,
  textAlign: 'center'
};

const iconStyle = {
  width: 50, 
  height: 50, 
  color: '#795548'
}

const featureTitleStyle = {

}

export default WelcomePage;
