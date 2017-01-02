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
import Layout from '../../../components/Layout';
import s from './styles.css';
import { connect } from 'react-redux';
import store from '../../../core/store';
import history from '../../../core/history';
import {bibleTranslations, books, chapterIdFromBookNumAndChapterNum, chapterIdFromName, bookIdFromChapterId, chapterNumFromChapterId} from '../../../core/bibleRef';

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
    let startBookId = bookIdFromChapterId(plan.startChapter);
    let startChapterId = chapterNumFromChapterId(plan.startChapter);
    let cursorBookId = bookIdFromChapterId(plan.cursor);
    let cursorChapterId = chapterNumFromChapterId(plan.cursor);
    let endBookId = bookIdFromChapterId(plan.endChapter);
    let endChapterId = chapterNumFromChapterId(plan.endChapter);
    this.state = { 
      open: false, 
      plan: plan,
      bookList: books.map(function(a) {return a.name;}),
      startBook: startBookId,
      startChapter: startChapterId,
      startChapterItems: books[startBookId].chapters.map(function(a, index) {
          return <MenuItem key={index+1} value={index+1} primaryText={index+1} />;
        }),
      cursorBook: cursorBookId,
      cursorChapter: cursorChapterId,
      cursorChapterItems: books[cursorBookId].chapters.map(function(a, index) {
          return <MenuItem key={index+1} value={index+1} primaryText={index+1} />;
        }),
      endBook: endBookId,
      endChapter: endChapterId,
      endChapterItems: books[endBookId].chapters.map(function(a, index) {
          return <MenuItem key={index+1} value={index+1} primaryText={index+1} />;
        }),
      finishDate: this.setFinishDate(true, cursorBookId, cursorChapterId, endBookId, endChapterId, plan.pace), 
      version: version,
      versionItems: versionItems 
    };
  }

  componentDidMount() {

  }

  handleChange = (event) => {
    let newPlan = this.state.plan;
    newPlan[event.target.id] = event.target.value;
    this.setState({
      plan: newPlan
    });
  }

  handleStartBook = (event, bookIndex, value) => {
    let chapters = [];
    books[bookIndex].chapters.map(function(a, index) {
      chapters.push(<MenuItem key={index+1} value={index+1} primaryText={index+1} />)
    });
    this.setState({
      startBook: value,
      startChapterItems: chapters 
    }, () => this.setFinishDate());
  }

  handleStartChapter = (event, index) => {
    this.setState({
      startChapter: index+1,
    }, () => this.setFinishDate());
  }

  handleCursorBook = (event, bookIndex, value) => {
    let chapters = [];
    books[bookIndex].chapters.map(function(a, index) {
      chapters.push(<MenuItem key={index+1} value={index+1} primaryText={index+1} />)
    });
    this.setState({
      cursorBook: value,
      cursorChapterItems: chapters 
    }, () => this.setFinishDate());
  }

  handleCursorChapter = (event, index) => {
    this.setState({
      cursorChapter: index+1,
    }, () => this.setFinishDate());
  }

  handleEndBook = (event, bookIndex, value) => {
    let chapters = [];
    books[bookIndex].chapters.map(function(a, index) {
      chapters.push(<MenuItem key={index+1} value={index+1} primaryText={index+1} />)
    });
    this.setState({
      endBook: value,
      endChapterItems: chapters 
    }, () => this.setFinishDate());
  }

  handleEndChapter = (event, index) => {
    this.setState({
      endChapter: index+1,
    }, () => this.setFinishDate());
  }

  setFinishDate = (initial, cursorBook = null, cursorChapter = null, endBook = null, endChapter = null, pace = null) => {
    cursorBook = (!this.state) ? cursorBook : this.state.cursorBook;
    cursorChapter = (!this.state) ? cursorChapter : this.state.cursorChapter;
    endBook = (!this.state) ? endBook : this.state.endBook;
    endChapter = (!this.state) ? endChapter : this.state.endChapter;
    pace = (!this.state) ? pace : this.state.plan.pace;
    let finishDate = null;
    finishDate = 
      new Date().getTime() + 
      (
        (chapterIdFromBookNumAndChapterNum(endBook, endChapter)
        - chapterIdFromBookNumAndChapterNum(cursorBook, cursorChapter)) / pace * 86400000); 
    
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
    
    let startReference = books[this.state.startBook].name + ' ' + this.state.startChapter;
    let endReference = books[this.state.endBook].name + ' ' + this.state.endChapter;
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plans/' + this.props.route.params.id).update({
      name: this.state.plan.name || startReference + ' - ' + endReference,
      startChapter: chapterIdFromBookNumAndChapterNum(this.state.startBook, this.state.startChapter),
      cursor: chapterIdFromBookNumAndChapterNum(this.state.cursorBook, this.state.cursorChapter),
      endChapter: chapterIdFromBookNumAndChapterNum(this.state.endBook, this.state.endChapter),
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
          <SelectField
            floatingLabelText="Starting Book"
            value={this.state.startBook}
            onChange={this.handleStartBook}
            style={{width: 150, marginRight: 16}}
            maxHeight={250}
          >
            {bookItems.map(function(a) { return a;})}
          </SelectField>
          <SelectField
            floatingLabelText="Chapter"
            value={this.state.startChapter}
            onChange={this.handleStartChapter}
            style={{width: 90}}
            maxHeight={250}
          >
            {(this.state.startBook !== null && this.state.startChapterItems !== null) && this.state.startChapterItems.map(function(a) { return a;})}
          </SelectField> <br />
          <SelectField
            floatingLabelText="Current Book"
            value={this.state.cursorBook}
            onChange={this.handleCursorBook}
            style={{width: 150, marginRight: 16}}
            maxHeight={250}
            errorText={(this.state.cursorBook > this.state.endBook || this.state.cursorBook < this.state.startBook) && "Invalid range"}
          >
            {bookItems.map(function(a) { return a;})}
          </SelectField>
          <SelectField
            floatingLabelText="Chapter"
            value={this.state.cursorChapter}
            onChange={this.handleCursorChapter}
            style={{width: 90}}
            maxHeight={250}
            errorText={(this.state.startChapter !== null && this.state.cursorChapter !== null && this.state.endChapter !== null &&
              (this.state.startBook === this.state.cursorBook && this.state.startChapter > this.state.cursorChapter) ||
              (this.state.endBook === this.state.cursorBook && this.state.endChapter < this.state.cursorChapter)) && "Invalid range"}
          >
            {(this.state.cursorBook !== null && this.state.cursorChapterItems !== null) && this.state.cursorChapterItems.map(function(a) { return a;})}
          </SelectField> <br />
          <SelectField
            floatingLabelText="Ending Book"
            value={this.state.endBook}
            onChange={this.handleEndBook}
            style={{width: 150, marginRight: 16}}
            maxHeight={250}
            errorText={(this.state.endBook !== null && this.state.startBook > this.state.endBook) && "Invalid range"}
          >
            {bookItems.map(function(a) { return a;})}
          </SelectField>
          <SelectField
            floatingLabelText="Chapter"
            value={this.state.endChapter}
            onChange={this.handleEndChapter}
            style={{width: 90}}
            maxHeight={250}
            errorText={(this.state.endChapter !== null && this.state.startBook === this.state.endBook && this.state.startChapter >= this.state.endChapter) && "Invalid range"}
          >
            {(this.state.endBook !== null && this.state.endChapterItems !== null) && this.state.endChapterItems.map(function(a) { return a;})}
          </SelectField><br />
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

const bookItems = books.map(function(a, index) {return <MenuItem key={index} value={index} primaryText={a.name} />;});

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
