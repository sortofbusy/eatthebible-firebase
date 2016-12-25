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
import PlanSelect from '../../components/ReadChapter/PlanSelect';
import s from './styles.css';
import { title, html } from './index.md';
import { connect } from 'react-redux';
import store from '../../core/store';
import history from '../../core/history';
import { dateIsToday, initializePlans, incrementPlan } from '../../core/planLogic';

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
    //initializePlans(this.props.plans, this.props.currentPlanId);
  }

  closeSnackbar = () => {
    this.setState({open: false});
  }

  nextChapter() {
    incrementPlan(this.props.plans, this.props.currentPlanId);
  }

  render() {
    return (
      <Layout className={s.content}>
        <div>
          {this.props.plans && this.props.currentPlanId && <div>
              <PlanSelect />
              <ReadChapter 
                plan={this.props.plans[this.props.currentPlanId]} 
                isLoading={this.props.isLoading}
                errorMsg={this.props.errorMsg}
                verses={this.props.verses} 
                nextChapterCB={this.nextChapter.bind(this)}
                textSize={this.props.settings.textSize}
                versionCode={this.props.settings.version.code}/>
          </div>}
          {!this.props.plans && <RaisedButton 
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
    user: store.user,
    plans: store.plans,
    isLoading: store.isLoading,
    verses: store.verses,
    errorMsg: store.errorMsg,
    currentPlanId: store.currentPlanId,
    settings: store.settings
  };
}

export default connect(mapStateToProps)(HomePage);
