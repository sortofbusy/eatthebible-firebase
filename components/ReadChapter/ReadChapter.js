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
import Verse from './Verse';
import {chapterNameFromId} from '../../core/bibleRef';
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
    this.httpGetAsync(`https://getbible.net/json?scripture=${encodeURIComponent(chapterNameFromId(this.props.chapter))}&v=${this.props.versionCode}`);
  }

  componentDidUpdate() {
    this.httpGetAsync(`https://getbible.net/json?scripture=${encodeURIComponent(chapterNameFromId(this.props.chapter))}&v=${this.props.versionCode}`);
  }

  httpGetAsync(theUrl)
  {
    fetchJsonp(theUrl)
      .then((response) => {
        return response.json()
      }).then((json) => {
        this.setState({verses: json.chapter});
      }).catch((ex) => {
        this.setState({errorMsg: ex});
      });
  }

  render() {
    if (!this.state.verses && !this.state.errorMsg) {
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
    if (!this.state.verses && this.state.errorMsg) {
      return <div>{'Chapter didn\'t load: ' + JSON.stringify(this.state.errorMsg)}</div>;
    }
    return (
      <div>
        <h2>{chapterNameFromId(this.props.chapter)}</h2>
        <div>{Object.values(this.state.verses).map((v) => <Verse key={v.verse_nr} verse={v} /> )}</div>
        <RaisedButton label="NEXT CHAPTER" secondary={true} style={{float: 'right', marginTop: 16}} onTouchTap={this.props.nextChapterCB}/>
      </div>
    );
  }

}

export default ReadChapter;