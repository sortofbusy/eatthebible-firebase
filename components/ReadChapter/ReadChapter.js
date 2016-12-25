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

import Verse from './Verse';
import {chapterNameFromId} from '../../core/bibleRef';

import Badge from 'material-ui/Badge';
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
    this.httpGetAsync(`https://getbible.net/json?scripture=${encodeURIComponent(chapterNameFromId(this.props.plan.cursor))}&v=${(this.props.plan.version) ? this.props.plan.version.code : this.props.versionCode}`);
  }

  componentDidUpdate() {
    scroll(0,0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && this.props && nextProps.plan.cursor !== this.props.plan.cursor)
      this.httpGetAsync(`https://getbible.net/json?scripture=${encodeURIComponent(chapterNameFromId(nextProps.plan.cursor))}&v=${(nextProps.plan.version) ? nextProps.plan.version.code : this.props.versionCode}`);
  }

  httpGetAsync(theUrl)
  {
    store.dispatch({
      type: 'TOGGLE_ISLOADING',
      isLoading: true
    });
    fetchJsonp(theUrl)
      .then((response) => {
        return response.json()
      }).then((json) => {
        store.dispatch({
            type: 'TOGGLE_ISLOADING',
            isLoading: false,
            verses: json.chapter
        });
        return;
      }).catch((ex) => {
        store.dispatch({
            type: 'TOGGLE_ISLOADING',
            isLoading: false,
            errorMsg: 'Error: ' + ex
        });
        return;
      });
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
                onTouchTap={() => this.httpGetAsync('https://getbible.net/json?scripture='+encodeURIComponent(chapterNameFromId(this.props.plan.cursor))+'&v='+((this.props.plan.version) ? this.props.plan.version.code : this.props.versionCode))}
                style={{marginTop: 60}} />
    }
    else return (
      <div style={{fontSize: this.props.textSize * 100 + '%'}}>
        <h2>{chapterNameFromId(this.props.plan.cursor)}</h2>
        <div>{this.props.verses && Object.values(this.props.verses).map((v) => <Verse key={v.verse_nr} verse={v} /> )}</div>
        <RaisedButton label="NEXT CHAPTER" secondary={true} style={{float: 'right', marginTop: 16}} onTouchTap={this.props.nextChapterCB}/>
      </div>
    );
  }

}

export default ReadChapter;