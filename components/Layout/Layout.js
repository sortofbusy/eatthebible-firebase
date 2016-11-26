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
import cx from 'classnames';
import Header from './Header';
import Footer from '../Footer';
import s from './Layout.css';

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


class Layout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    const divProps = Object.assign({}, props);
    delete divProps.user;
    this.state = {open: false, divProps: divProps};
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <div>
        <AppBar
          title="Eat the Bible"
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        <Drawer
          docked={false}
          width={280}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <Header user={this.props.user}/>
        </Drawer>
        <div {...this.state.divProps} className={cx(s.content, this.props.className)} />
        <Footer />
      </div>
    );
  }
}

export default Layout;
