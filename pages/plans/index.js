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
import {chapterNameFromId} from '../../core/bibleRef';

import muiThemeable from 'material-ui/styles/muiThemeable';
import {red500} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionLanguage from 'material-ui/svg-icons/action/language';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentForward from 'material-ui/svg-icons/content/forward';

class PlansPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      dialogOpen: false,
      snackbarMessage: '',
      snackbarOpen: false 
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
    this.setState({
      snackbarOpen: true,
      snackbarMessage: 'Plan created'
    });
  }

  handleDialog = (ignore, doIt = false) => {
    if (doIt) {
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plans/' + this.state.toDelete).remove(); 
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'Plan deleted'
      });
    }
    this.setState({dialogOpen: false});
  }

  startDelete = (id) => {
    this.setState({dialogOpen: true, toDelete: id})
  }

  showVersion = (id) => {
    if(!this.props.plans[id].version) return null;
    
    let versionReturn = this.props.plans[id].version.name;
    if (this.props.plans[id].version.language !== 'English')
      return <span>{versionReturn} <i>({this.props.plans[id].version.language})</i></span>;
    else return versionReturn;
  }

  getFinishDate = (plan) => {
    let finishDate = null;
    finishDate = new Date().getTime() + ((plan.endChapter - plan.cursor) / plan.pace * 86400000); 
    finishDate = new Date(finishDate).toLocaleDateString('en-US');
    var options = {
        year: "numeric", 
        month: "long", 
        day: "numeric"
    };
    return finishDate;
  }

  closeSnackbar = () => {
    this.setState({snackbarOpen: false, snackbarMessage: ''});
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
                subtitle={'You should finish by ' + this.getFinishDate(this.props.plans[id])}
              />
              <CardText>
              <List>
                <ListItem
                  primaryText={<span>Next chapter: {chapterNameFromId(this.props.plans[id].cursor)}</span>}
                  leftIcon={<ContentForward />}
                />
                {this.props.plans[id].version && <ListItem 
                  primaryText={this.showVersion(id)}
                  leftIcon={<ActionLanguage />}
                />}
              </List>
              </CardText>
              <CardActions>
                <FlatButton 
                  label="EDIT" 
                  style={{color: this.props.muiTheme.palette.accent1Color}} 
                  icon={<ImageEdit />}
                  onTouchTap={() => history.push({ pathname: '/plans/edit/' + id })} 
                />
                <FlatButton label="DELETE" style={{color: red500}} icon={<ActionDelete />} onTouchTap={() => this.startDelete(id)}/>
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
        <Dialog
          actions={[<FlatButton label="CANCEL" primary={true} onTouchTap={this.handleDialog.bind(this)}/>,
            <FlatButton label="DELETE" primary={true} onTouchTap={this.handleDialog.bind(this, true)}/>]}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialog.bind(this)}
        >
          Delete this plan permanently?
        </Dialog> 
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        /> 
      </Layout>
    );
  }

}

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
