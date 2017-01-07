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
import ReadChapter from '../../components/ReadChapter';
import s from './styles.css';
import { title, html } from './index.md';
import { connect } from 'react-redux';
import store from '../../core/store';
import history from '../../core/history';
import { dateIsToday, initializePlans, incrementPlan } from '../../core/planLogic';

import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Snackbar from 'material-ui/Snackbar';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    let redirecting = false;

    this.state = {
      open: false
    }
  }

  componentWillMount() {
    if (this.props.auth && !firebase.auth().currentUser) {
      history.push({ pathname: '/welcome' });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth && !firebase.auth().currentUser) {
      history.push({ pathname: '/welcome' });
    }
  }

  closeSnackbar = () => {
    this.setState({open: false});
  }

  nextChapter() {
    incrementPlan(this.props.plans, this.props.currentPlanId);
  }

  render() {
    if (this.props.auth && !firebase.auth().currentUser) return (
      <Layout className={s.content}>
        <RefreshIndicator
          size={40}
          top={60}
          left={0}
          status="loading"
          style={{display: 'inline-block', position: 'relative'}}
        />
      </Layout>);
    else return (
      <Layout className={s.content} reading={true}>
        <div>
          {this.props.plans && this.props.currentPlanId && this.props.settings && <div>
              <ReadChapter 
                plan={this.props.plans[this.props.currentPlanId]} 
                isLoading={this.props.isLoading}
                errorMsg={this.props.errorMsg}
                chapter={this.props.chapter} 
                nextChapterCB={this.nextChapter.bind(this)}
                settings={this.props.settings}
              />
          </div>}
          {this.props.auth && !this.props.plans && <RaisedButton 
                                label="CHOOSE A PLAN" 
                                onTouchTap={() => history.push({pathname: '/plans'})}
                                style={{marginTop: 60}} />}
        </div>
        <p>
          <br /><br />
        </p>
        <Snackbar
          open={this.state.open}
          message="Plan Completed"
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        />
      </Layout>
    );
  }

}

const mapStateToProps = function(store) {
  return {
    auth: store.auth,
    user: store.user,
    plans: store.plans,
    isLoading: store.isLoading,
    chapter: store.chapter,
    errorMsg: store.errorMsg,
    currentPlanId: store.currentPlanId,
    settings: store.settings
  };
}

export default connect(mapStateToProps)(HomePage);
