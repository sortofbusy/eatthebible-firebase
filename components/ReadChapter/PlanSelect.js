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
import store from '../../core/store';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';

class PlanSelect extends React.Component {

  selectPlan(newPlanId) {
    firebase.database().ref('users').child(firebase.auth().currentUser.uid).update({
      currentPlanId: newPlanId
    });
  }

  render() {
    return (
      <div style={styles.wrapper}><Paper style={styles.paper}>
        {Object.keys(this.props.plans).map((key) => {
          let plan = this.props.plans[key];
          
          return(
          <Chip style={styles.chip} onTouchTap={this.selectPlan.bind(this, key)} key={key}>
            <Avatar backgroundColor={(key === this.props.currentPlanId ? '#ffb300' : '')} color={(key === this.props.currentPlanId ? '' : '#444')}>{(plan.chaptersToday || '0') + '/' + plan.pace}</Avatar>
            {plan.name}
          </Chip> )} ) 
        }
      </Paper></div>
    );
  }

}

const styles = {
  chip: {
    marginRight: 8,
    marginBottom: 8
  },
  wrapper: {
    paddingTop: 16
  },
  paper: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingRight: 8,
    paddingLeft: 16,
    paddingBottom: 8
  }
};

export default PlanSelect;