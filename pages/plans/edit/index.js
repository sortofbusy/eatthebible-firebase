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
import ChapterSelector from '../../../components/ChapterSelector/ChapterSelector';
import Layout from '../../../components/Layout';
import s from './styles.css';
import { connect } from 'react-redux';
import store from '../../../core/store';
import history from '../../../core/history';
import {bibleTranslations, chapterNameFromId} from '../../../core/bibleRef';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

class PlansEditPage extends React.Component {
  
  constructor(props) {
    super(props);
    let plan = Object.assign({}, props.plans[props.route.params.id]);
    let version = (plan.version) ? plan.version : props.settings.version;
    let versionItems = bibleTranslations.map(function(a, index) {
          if (a.language === version.language) return <MenuItem key={index} value={a.code} primaryText={a.name} />;
        });
     
    this.state = { 
      open: false, 
      plan: plan,
      finishDate: this.setFinishDate(true, plan), 
      version: version,
      versionItems: versionItems 
    };
  }

  handleChange = (event) => {
    let newPlan = this.state.plan;
    newPlan[event.target.id] = event.target.value;
    this.setState({
      plan: newPlan
    });
  }

  startChapterCallback = (startChapter) => {
    let newPlan = Object.assign({}, this.state.plan);
    newPlan.startChapter = startChapter;
    this.setState({
      plan: newPlan
    }, () => this.setFinishDate());
  }

  currentChapterCallback = (currentChapter) => {
    let newPlan = Object.assign({}, this.state.plan);
    newPlan.cursor = currentChapter;
    this.setState({
      plan: newPlan
    }, () => this.setFinishDate());
  }

  endChapterCallback = (endChapter) => {
    let newPlan = Object.assign({}, this.state.plan);
    newPlan.endChapter = endChapter;
    this.setState({
      plan: newPlan
    }, () => this.setFinishDate());
  }

  setFinishDate = (initial, plan = null) => {
    let cursorChapter = (!this.state) ? plan.cursor : this.state.plan.cursor;
    let endChapter = (!this.state) ? plan.endChapter : this.state.plan.endChapter;
    let pace = (!this.state) ? plan.pace : this.state.plan.pace;
    
    let finishDate = null;
    finishDate = 
      new Date().getTime() + 
      ( (endChapter - cursorChapter) / pace * 86400000); 
    
    finishDate = new Date(finishDate);
    var options = {
        year: "numeric", 
        month: "long", 
        day: "numeric"
    };

    if (initial) {
      return finishDate.toLocaleDateString('en-US');
    } else {
      this.setState({
        finishDate: finishDate.toLocaleDateString('en-US')
      });
    }
  }

  handlePace = (event, value) => {
    let newPlan = this.state.plan;
    newPlan.pace = value;
    this.setState({
      plan: newPlan
    }, () => this.setFinishDate());
  }

  handleLanguage = (event, index, value) => {
    let versionItems = [];
    bibleTranslations.map( (a, index) => {
      if (a.language === value) versionItems.push(<MenuItem key={index} value={a.code} primaryText={a.name} />);
    });
    this.setState({
      version: Object.assign({}, {language: value, code: this.state.version.code, name: this.state.version.name}),      
      versionItems: versionItems
    });
  }

  handleVersion = (event, index, value) => {
    this.setState({
      version: Object.assign({}, {language: this.state.version.language, code: value, name: event.target.innerHTML})
    });
  }

  closeSnackbar = () => {
    this.setState({open: false});
    history.push({ pathname: '/plans' });
  }

  handleSubmit = () => {
    
    let startReference = chapterNameFromId(this.state.plan.startChapter);
    let endReference = chapterNameFromId(this.state.plan.endChapter);
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plans/' + this.props.route.params.id).update({
      name: this.state.plan.name || startReference + ' - ' + endReference,
      startChapter: this.state.plan.startChapter,
      cursor: this.state.plan.cursor,
      endChapter: this.state.plan.endChapter,
      version: this.state.version,
      pace: this.state.plan.pace
    });
    this.setState({
      open: true
    });
    
  }

  render() {
    let isDefault = (this.props.plan.version) ? '' : ' (Default)';
    return (
      <Layout className={s.content}>
        <h2>Edit Plan</h2>
        <div>
          <TextField
            id="name"
            value={this.state.plan.name}
            onChange={this.handleChange}
            floatingLabelText="Name"
          /><br />
          <SelectField
            floatingLabelText={'Language to Read'+isDefault}
            value={this.state.version.language}
            onChange={this.handleLanguage}
            maxHeight={250}
          >
            {languageItems}
          </SelectField> <br />
          <SelectField
            floatingLabelText={'Version to Read'+isDefault}
            value={this.state.version.code}
            onChange={this.handleVersion}
            maxHeight={250}
          >
            {this.state.versionItems}
          </SelectField><br />
          <ChapterSelector
            label="Starting"
            chapterId={this.state.plan.startChapter}
            _callback={this.startChapterCallback}
            lessThan={this.state.plan.cursor}
          />
          <ChapterSelector
            label="Current"
            chapterId={this.state.plan.cursor}
            _callback={this.currentChapterCallback}
            greaterThan={this.state.plan.startChapter}
            lessThan={this.state.plan.endChapter}
          />
          <ChapterSelector
            label="Ending"
            chapterId={this.state.plan.endChapter}
            _callback={this.endChapterCallback}
            greaterThan={this.state.plan.cursor}
          />
          <br />
          <p style={styles.label}><b>{this.state.plan.pace}</b> chapter(s) / day{this.state.finishDate && ", finish " + this.state.finishDate}</p>
          <div style={styles.wrapper}>
            <Slider id="pace" step={1} min={1} max={7} value={this.state.plan.pace} onChange={this.handlePace}/>
          </div>
          <RaisedButton style={styles.create} label="Save Changes" primary={true} onTouchTap={this.handleSubmit.bind(this)} />
        </div>
        <p>
          <br /><br />
        </p>
        <Snackbar
          open={this.state.open}
          message="Plan updated"
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        />
      </Layout>
    );
  }

}

const languageItems = ['Afrikaans','Albanian','Amharic','Arabic','Aramaic','Armenian','Basque','Breton','Bulgarian','Chamorro','Chinese','Croatian','Danish','Dutch','English','Esperanto',
  'Estonian','Finnish','French','German','Greek','Hebrew','Hungarian','Italian','Korean','Norwegian','Portuguese','Russian',
  'Spanish','Swahili','Swedish','Turkish','Vietnamese','Xhosa']
    .map(function(a, index) {return <MenuItem key={index} value={a} primaryText={a} />;});



const styles = {
  chip: {
    marginRight: 8,
    marginBottom: 8
  },
  wrapper: {
    paddingLeft: 32,
    paddingRight: 32,
    width: 200
  },
  label: {
    font: 'Roboto', 
    fontSize: 16
  },
  create: {
    marginLeft: 160
  }
};

const mapStateToProps = function(store) {
  return {
    plans: store.plans,
    settings: store.settings
  };
}

export default connect(mapStateToProps)(PlansEditPage);
