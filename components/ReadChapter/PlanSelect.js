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
import { connect } from 'react-redux';
import store from '../../core/store';
import muiThemeable from 'material-ui/styles/muiThemeable';

import { dateIsToday } from '../../core/planLogic';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import ActionDone from 'material-ui/svg-icons/action/done';

class PlanSelect extends React.Component {

  selectPlan(newPlanId) {
    firebase.database().ref('users').child(firebase.auth().currentUser.uid).update({
      currentPlanId: newPlanId
    });
  }

  render() {
    let chapterCount = {};
    
    if (this.props.plans) {
      let planKeys = Object.keys(this.props.plans);

      for (let i = 0; i < planKeys.length; i++) {
        chapterCount[planKeys[i]] = (!this.props.plans[planKeys[i]].latestTimestamp 
          || !dateIsToday(this.props.plans[planKeys[i]].latestTimestamp)) ? 0 : this.props.plans[planKeys[i]].chaptersToday;
      }
    }

    return (
      <div style={styles.wrapper}><Paper style={{...styles.paper,...{backgroundColor: this.props.backgroundColor}}}>
        {Object.keys(this.props.plans).map((key) => {
          let plan = this.props.plans[key];
          let avatarColor = '';
          let chipColor = '';
          let textColor = '#444';
          
          if (chapterCount[key] >= plan.pace) {
            //avatarColor = this.props.muiTheme.palette.accent2Color;
            //chipColor = this.props.muiTheme.palette.accent3Color;
            //textColor = '';
          }
          if (key === this.props.currentPlanId) {
            avatarColor = this.props.muiTheme.palette.primary1Color;
            chipColor = this.props.muiTheme.palette.primary3Color;
            textColor = '';
          }
          return(
          <Chip style={styles.chip} backgroundColor={chipColor} labelColor={textColor} onTouchTap={this.selectPlan.bind(this, key)} key={key}>
            <Avatar backgroundColor={avatarColor} color={textColor}>{chapterCount[key] + '/' + plan.pace}</Avatar>
            {plan.name}
          </Chip> )} ) 
        }
      </Paper></div>
    );
  }

}

const styles = {
  chip: {
    display: 'inline-flex',
    verticalAlign: 'middle',
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

const mapStateToProps = function(store) {
  let backgroundColor = '';
  if (store.settings && store.settings.colorScheme === 'sepia') backgroundColor = '#FBF0D9';
  return {
    plans: store.plans,
    currentPlanId: store.currentPlanId,
    backgroundColor: backgroundColor
  };
}

export default connect(mapStateToProps)(muiThemeable()(PlanSelect));