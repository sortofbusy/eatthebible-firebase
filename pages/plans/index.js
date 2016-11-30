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

import muiThemeable from 'material-ui/styles/muiThemeable';
import {red500} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';


const defaultPlans = 
  [
    { name: 'Whole Bible (1 year)',
      plans: [{
        name: 'Old Testament (1 year)',
        startChapter: 1,
        endChapter: 929,
        cursor: 1,
        pace: 3
      },
      {
        name: 'New Testament (1 year)',
        startChapter: 930,
        endChapter: 1189,
        cursor: 930,
        pace: 1
      }]
    },
    { name: 'New Testament (6 months)',
      plans: [{
        name: 'New Testament (6 months)',
        startChapter: 930,
        endChapter: 1189,
        cursor: 930,
        pace: 2
      }]
    } 
  ];


class PlansPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      loading: true, 
      plans: [
        {
          id: 4,
          name: "New Testament",
          start: 5,
          end: 234,
          pace: 3,
        }]
    };
  }


  componentDidMount() {
    //document.title = config.title;
    if(!firebase.auth().currentUser) history.push({ pathname: '/welcome' });
  }

  createPlan(index) {
    for (var i = 0; i < defaultPlans[index].plans.length; i++) {
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plans').push(defaultPlans[index].plans[i]);
    }
  }

  deletePlan(id) {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plans/' + id).remove();
  }

  render() {
    return (
      <Layout className={s.content}>
        <h2>Plans</h2>
        {this.props.plans && Object.keys(this.props.plans).map((id) => 
          <div key={id}>
            <Card >
              <CardHeader
                title={this.props.plans[id].name}
                subtitle={this.props.plans[id].startChapter + ' to ' + this.props.plans[id].endChapter}
                //actAsExpander={true}
                //showExpandableButton={true}
              />
              <CardText>
                Lorem ipsum dolor sit amet.
              </CardText>
              <CardActions>
                <FlatButton label="EDIT" style={{color: this.props.muiTheme.palette.accent1Color}} icon={<ImageEdit />} />
                <FlatButton label="DELETE" style={{color: red500}} icon={<ActionDelete />} onTouchTap={() => this.deletePlan(id)}/>
              </CardActions>
            </Card>
            <br />
          </div>
        )}
        <Card>
          <CardTitle
            title="Add a Plan"
            subtitle="Pick an option, or create your own"
          />
          <div style={styles.wrapper}>
            {defaultPlans.map((plan, index) => <Chip style={styles.chip} onTouchTap={() => this.createPlan(index)} key={index}>{plan.name}</Chip>)}
            <Chip style={styles.chip} onTouchTap={() => history.push({ pathname: '/plans/new' })}>
              <Avatar color="#444" icon={<ContentAdd />} /> Create Custom Plan
            </Chip>
          </div>
        </Card>  
      </Layout>
    );
  }

}

const styles = {
  chip: {
    marginRight: 8,
    marginBottom: 8
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: 16,
    paddingBottom: 16
  }
};

const mapStateToProps = function(store) {
  return {
    plans: store.plans
  };
}

export default connect(mapStateToProps)(muiThemeable()(PlansPage));
