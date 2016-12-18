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
import { title, html } from './index.md';
import { connect } from 'react-redux';
import store from '../../core/store';
import history from '../../core/history';
import { AuthUI, uiConfig } from '../../core/auth';

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
      <Layout className={s.content}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className={s.firebaseUiAuth} id="firebaseui-auth-container"></div>
          <br /><br />
      </Layout>
    );
    
  }

}

const mapStateToProps = function(store) {
  return {
    user: store.user
  };
}

export default connect(mapStateToProps)(WelcomePage);
