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

import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      open: false
    }
  }

  componentDidMount() {
    //document.title = config.title;
    //if(!this.props.user) history.push({ pathname: '/welcome' });
  }

  componentDidUpdate() {
    scroll(0,0);
  }

  closeSnackbar = () => {
    this.setState({open: false});
  }

  nextChapter() {
    let plan = this.props.plans[this.props.currentPlanId];
    if (plan.cursor + 1 > plan.endChapter) {
      this.setState({open: true});
      return;
    }
    let newCursor = plan.cursor + 1;
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plans/' + this.props.currentPlanId).update({
      cursor: newCursor
    });
  }

  render() {
    return (
      <Layout className={s.content}>
        <div>
          {this.props.currentPlanId && <ReadChapter 
                                chapter={this.props.plans[this.props.currentPlanId].cursor} 
                                versionCode={this.props.plans[this.props.currentPlanId].version.code || 'asv'} 
                                nextChapterCB={this.nextChapter.bind(this)}/>}
          {!this.props.currentPlanId && <RaisedButton 
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
  let currentPlanId = null;
  if (store.plans) currentPlanId = Object.keys(store.plans)[0];
  return {
    user: store.user,
    plans: store.plans,
    currentPlanId: currentPlanId
  };
}

export default connect(mapStateToProps)(HomePage);
