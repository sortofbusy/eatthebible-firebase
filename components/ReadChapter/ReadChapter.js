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

import Verse from './Verse';
import {chapterNameFromId, verseChunksFromChapterId} from '../../core/bibleRef';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import RaisedButton from 'material-ui/RaisedButton';

class ReadChapter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      verses: null
    };
  }

  componentDidMount() {
    this.httpGetAsync(this.props.plan.cursor, this.props.plan);
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
    return <Verse key={v.ref} verse={v} chapterId={this.props.plan.cursor} notes={notes}/>
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div style={{textAlign: 'center'}}>
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
      return <RaisedButton 
                label="RELOAD" 
                onTouchTap={() => this.httpGetAsync(this.props.plan.cursor, this.props.plan)}
                style={{marginTop: 60}} />
    }
    else {
      let textSize = (this.props.settings) ? this.props.settings.textSize * 100 + '%' : '100%'; 
      return (
        <div style={{fontSize: textSize}}>
          <h2>{chapterNameFromId(this.props.plan.cursor)}</h2>
          {this.props.chapter && 
            <div>{this.props.chapter.verses.map(this.mapVerses)}</div>}
          {this.props.chapter && <div style={{fontSize: '60%', marginTop: 8}}>{this.props.chapter.copyright}</div>}
          <RaisedButton label="NEXT CHAPTER" secondary={true} style={{float: 'right', marginTop: 16}} onTouchTap={this.props.nextChapterCB}/>
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