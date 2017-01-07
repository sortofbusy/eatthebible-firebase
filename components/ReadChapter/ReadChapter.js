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
import fetchJsonp from 'fetch-jsonp';
import s from './ReadChapter.css';
import store from '../../core/store';
import { connect } from 'react-redux';

import PlanSelect from './PlanSelect';
import Verse from './Verse';
import {chapterNameFromId, verseChunksFromChapterId} from '../../core/bibleRef';

import Badge from 'material-ui/Badge';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';
import ActionToday from 'material-ui/svg-icons/action/today';
import EditorEdit from 'material-ui/svg-icons/editor/mode-edit';

class ReadChapter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      verses: null,
      viewEdit: false,
      viewPlans: false
    };
  }

  componentWillMount() {
    //this.updateDimensions();
  }
  
  componentDidMount() {
    //window.addEventListener("resize", this.updateDimensions);
    this.httpGetAsync(this.props.plan.cursor, this.props.plan);
  }

  componentWillUnmount() {
    //window.removeEventListener("resize", this.updateDimensions);
  }
  
  componentDidUpdate() {
    scroll(0,0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && this.props && nextProps.plan.cursor !== this.props.plan.cursor) {
      this.httpGetAsync(nextProps.plan.cursor, nextProps.plan); 
    }
  }

  httpGetAsync = (chapterId, plan) => {
    let version = null;
    if (this.props.settings) version = this.props.settings.version;
    if (plan && plan.version) version = plan.version;
    if (!version) version = { language: 'English', name: 'American Standard Version', code: 'asv'};

    store.dispatch({
      type: 'TOGGLE_ISLOADING',
      isLoading: true
    });
    if (version.code === 'rcv') {
      var calls = [];
      let chunks = verseChunksFromChapterId(chapterId);
      for(var i =0; i < chunks.length; i++) {
        calls.push(this.httpChunkCall(chunks[i]));
      }
      Promise.all(calls)
      .then(function (result) {
            //combine all verses into one array

          var combined = {};
          combined.verses = [];
          combined.inputstring = result[0].inputstring.split(':')[0];
          for (var i = 0; i < result.length; i++) {
            combined.verses = combined.verses.concat(result[i].verses);
          }
          
            // replace chars for HTML output
          for (i = 0; i < combined.verses.length; i++) {
            combined.verses[i].text = combined.verses[i].text.split('[').join('<i>');
            combined.verses[i].text = combined.verses[i].text.split(']').join('</i>');
            combined.verses[i].text = combined.verses[i].text.split('--').join('&mdash;');
            combined.verses[i].ref = combined.verses[i].ref.split(':')[1];
          }
          
          combined.copyright = result[0].copyright;
          store.dispatch({
              type: 'TOGGLE_ISLOADING',
              isLoading: false,
              chapter: combined
          });
      })
      .catch((ex) => {
        store.dispatch({
            type: 'TOGGLE_ISLOADING',
            isLoading: false,
            errorMsg: 'Error: ' + ex
        });
      });
    } else {
      fetchJsonp(`https://getbible.net/json?scripture=${encodeURIComponent(chapterNameFromId(chapterId))}&v=${version.code}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          let combined = {};
          combined.verses = [];
          combined.inputstring = json.book_name + ' ' + json.chapter_nr;
          let language = (version.language !== 'English') ? ` [${version.language}]` : '';
          combined.copyright = version.name + language + ' text from getbible.net';

          for (var i in json.chapter) {
            combined.verses.push({ref: json.chapter[i].verse_nr, text: json.chapter[i].verse.split('--').join('&mdash;')});
          }
          store.dispatch({
              type: 'TOGGLE_ISLOADING',
              isLoading: false,
              chapter: combined
          });
        })
        .catch((ex) => {
          store.dispatch({
              type: 'TOGGLE_ISLOADING',
              isLoading: false,
              errorMsg: 'Error: ' + ex
          });
        });
    }
  }

  httpChunkCall = (chunk) => {
    return fetch(`https://api.lsm.org/recver.php?String=${encodeURIComponent(chunk)}&Out=json`)
      .then((response) => {
        return response.json()
      });
  }

  mapVerses = (v) => {
    let notes = (this.props.notesByChapter) ? this.props.notesByChapter[v.ref] : null;
    return <Verse key={v.ref} verse={v} chapterId={this.props.plan.cursor} notes={notes} editMode={this.state.viewEdit}/>
  }

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({viewEdit: !this.state.viewEdit});
  };

  togglePlans = (e) => {
    e.preventDefault();
    this.setState({viewPlans: !this.state.viewPlans});
  };

  updateDimensions = () => {

    let w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

    this.setState({width: width, height: height});
  };


  render() {
    let editColor = (this.state.viewEdit) ? '#424242' : '#9E9E9E';
    let plansColor = (this.state.viewPlans) ? '#424242' : '#9E9E9E';
    if (this.props.isLoading) {
      return (
        <div id='readChapter' style={{textAlign: 'center'}}>
          <RefreshIndicator
            size={40}
            top={60}
            left={0}
            status="loading"
            style={{display: 'inline-block', position: 'relative'}}
          />
        </div>
      );
    }
    else if (this.props.errorMsg) {
      console.log()
      return (
        <div id='readChapter'>
          {this.state.viewPlans && <PlanSelect />}
          <RaisedButton 
            label="RELOAD" 
            onTouchTap={() => this.httpGetAsync(this.props.plan.cursor, this.props.plan)}
            style={{marginTop: 60}} 
          />
          <span style={{float: 'right', paddingRight: 8, marginTop: 60}}>
            <ActionToday 
              style={{color: plansColor, cursor: 'pointer'}}
              onTouchTap={this.togglePlans}/>
          </span>
        </div>
      );
    }
    else {
      let textSize = (this.props.settings) ? this.props.settings.textSize * 100 + '%' : '100%'; 
      let contentStyle = {fontSize: textSize, fontFamily: 'serif, !important', textAlign: 'justify', lineHeight: '180%'};
      if (this.state.height) {
        contentStyle.height = 350;
        contentStyle.overflowY = 'scroll';
      }
      return (
        <div>
          {this.state.viewPlans && <PlanSelect />}
          <h2>
            {chapterNameFromId(this.props.plan.cursor)}
            <span style={{float: 'right', paddingRight: 8}}>
              <EditorEdit 
                style={{color: editColor, cursor: 'pointer', marginRight: 16}}
                onTouchTap={this.toggleEdit}/>
              <ActionToday 
                style={{color: plansColor, cursor: 'pointer'}}
                onTouchTap={this.togglePlans}/>
            </span>
          </h2>
          <div style={contentStyle}>
            {this.props.chapter && 
              <div>{this.props.chapter.verses.map(this.mapVerses)}</div>}
            {this.props.chapter && <div style={{fontSize: '60%', marginTop: 8}}>{this.props.chapter.copyright}</div>}
            <RaisedButton label="NEXT CHAPTER" style={{float: 'right', marginTop: 16, marginBottom: 8, marginRight: 8}} onTouchTap={this.props.nextChapterCB}/>
            <br />
          </div>
        </div>
      );
    }
  }

}

const mapStateToProps = function(store) {
  return {
    notesByChapter: store.notesByChapter
  };
}

export default connect(mapStateToProps)(ReadChapter);