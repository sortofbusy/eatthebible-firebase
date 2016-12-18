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
import cx from 'classnames';
import {chapterNameFromId} from '../../core/bibleRef';


class PlanSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chapterName: chapterNameFromId(this.props.chapter),
      chapterText: null
    };
  }

  componentDidMount() {
    this.httpGetAsync(`https://getbible.net/json?scripture=${encodeURIComponent(this.state.chapterName)}&v=${this.props.versionCode}`);
  }

  httpGetAsync(theUrl)
  {
    fetchJsonp(theUrl)
      .then((response) => {
        return response.json()
      }).then((json) => {
        this.setState({chapterText: json.chapter});
      }).catch((ex) => {
        console.log('parsing failed', ex)
      });
  }

  render() {
    return (
      <div>
        <h2>{this.state.chapterName}</h2>
        <Verses chapter={this.state.chapterText} />
      </div>
    );
  }

}

export default PlanSelect;