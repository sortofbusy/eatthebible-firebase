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

import RaisedButton from 'material-ui/RaisedButton';

class HomePage extends React.Component {

  static propTypes = {
    articles: PropTypes.array.isRequired,
  };

  componentDidMount() {
    document.title = title;
    if(!this.props.user) history.push({ pathname: '/welcome' });
  }

  render() {
    return (
      <Layout className={s.content} user={this.props.user}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <h4>Articles</h4>
        <div>
          {JSON.stringify(this.props.user)}
          <RaisedButton label="Default" />
        </div>
        <p>
          <br /><br />
        </p>
      </Layout>
    );
  }

}

const mapStateToProps = function(store) {
  return {
    user: store.user
  };
}

export default connect(mapStateToProps)(HomePage);
