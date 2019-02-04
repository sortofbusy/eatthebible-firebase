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
import {bibleTranslations, books, chapterIdFromBookNumAndChapterNum, chapterIdFromName, chapterNameFromId} from '../../../core/bibleRef';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

class PlansNewPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      open: false, 
      plan: {
        name: '',
        pace: 1
      },
      finishDate: null,
      startChapter: 1,
      endChapter: 1,
      version: { 
        language: 'English', 
        name: 'American Standard Version', 
        code: 'asv'
      }
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
    this.setState({
      startChapter: startChapter,
    }, () => this.setFinishDate());
  }

  endChapterCallback = (endChapter) => {
    this.setState({
      endChapter: endChapter,
    }, () => this.setFinishDate());
  }

  setFinishDate = () => {
    if(this.state.startChapter === null || this.state.endChapter === null) {
      return;
    }
    let finishDate = null;
    finishDate = 
      new Date().getTime() + 
      ( (this.state.endChapter - this.state.startChapter) / this.state.plan.pace * 86400000 ); 
    
    finishDate = new Date(finishDate);
    var options = {
        year: "numeric", 
        month: "long", 
        day: "numeric"
    };
    this.setState({
      finishDate: finishDate.toLocaleDateString('en-US')
    });
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
    if(this.state.startChapter === null || this.state.endChapter === null) {
      return;
    }
    let startReference = chapterNameFromId(this.state.startChapter);
    let endReference = chapterNameFromId(this.state.endChapter);
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plans').push({
      name: this.state.plan.name || startReference + ' - ' + endReference,
      startChapter: this.state.startChapter,
      endChapter: this.state.endChapter,
      cursor: this.state.startChapter,
      version: this.state.version,
      pace: this.state.plan.pace
    });
    this.setState({
      open: true
    });
    
  }

  render() {
    return (
      <Layout className={s.content}>
        <h3>Create Plan</h3>
        <div>
          <TextField
            id="name"
            value={this.state.plan.name}
            onChange={this.handleChange}
            floatingLabelText="Name"
          /><br />
          <SelectField
            floatingLabelText="Language to Read"
            value={this.state.version.language}
            onChange={this.handleLanguage}
            maxHeight={250}
          >
            {languageItems}
          </SelectField> <br />
          <SelectField
            floatingLabelText="Version to Read"
            value={this.state.version.code}
            onChange={this.handleVersion}
            maxHeight={250}
          >
            {this.state.versionItems || englishVersions}
          </SelectField><br />
          <ChapterSelector
            label="Start"
            chapterId={1}
            _callback={this.startChapterCallback}
            lessThan={this.state.endChapter}
          />
          <ChapterSelector
            label="End"
            chapterId={1}
            _callback={this.endChapterCallback}
            greaterThan={this.state.startChapter}
          />
          <br />
          <p style={styles.label}><b>{this.state.plan.pace}</b> chapter(s) / day{this.state.finishDate && ", finish " + this.state.finishDate}</p>
          <div style={styles.wrapper}>
            <Slider id="pace" step={1} min={1} max={7} value={this.state.plan.pace} onChange={this.handlePace}/>
          </div>
          <RaisedButton style={styles.create} label="Create" primary={true} onTouchTap={this.handleSubmit.bind(this)} />
        </div>
        <p>
          <br /><br />
        </p>
        <Snackbar
          open={this.state.open}
          message="Plan Created"
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        />
      </Layout>
    );
  }

}

const bookItems = books.map(function(a, index) {return <MenuItem key={index} value={index} primaryText={a.name} />;});

const languageItems = ['Afrikaans','Albanian','Amharic','Arabic','Chinese','Croatian','Danish','Dutch','English','Esperanto',
  'Estonian','Finnish','French','German','Greek','Hebrew','Hungarian','Italian','Korean','Norwegian','Portuguese','Russian',
  'Spanish','Swahili','Swedish','Turkish','Vietnamese','Xhosa']
    .map(function(a, index) {return <MenuItem key={index} value={a} primaryText={a} />;});

const englishVersions = bibleTranslations.map(function(a, index) {
  if (a.language === 'English') return <MenuItem key={index} value={a.code} primaryText={a.name} />;
});

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
    //user: store.user
  };
}

export default connect(mapStateToProps)(PlansNewPage);
