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
import { connect } from 'react-redux';
import store from '../../core/store';
import history from '../../core/history';
import {bibleTranslations, books} from '../../core/bibleRef';

import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

class SettingsPage extends React.Component {
  
  constructor(props) {
    super(props);
    let versionItems = null;
    let notifications = null;
    let textSize = null;
    let version = null;
    if (props.settings && props.settings.version) {
      versionItems = bibleTranslations.map(function(a, index) {
          if (a.language === props.settings.version.language) return <MenuItem key={index} value={a.code} primaryText={a.name} />;
        });
      notifications = props.settings.notifications;
      textSize = props.settings.textSize;
      version = props.settings.version;
    }

    this.state = { 
      open: false,
      notifications: notifications,
      textSize: textSize,
      version: version,
      versionItems: versionItems
    };
  }

  componentWillReceiveProps(nextProps) {
    let versionItems = null;
    let notifications = null;
    let textSize = null;
    let version = null;
    if (nextProps.settings && nextProps.settings.version) {
      versionItems = bibleTranslations.map(function(a, index) {
          if (a.language === nextProps.settings.version.language) return <MenuItem key={index} value={a.code} primaryText={a.name} />;
        });
      notifications = nextProps.settings.notifications;
      textSize = nextProps.settings.textSize;
      version = nextProps.settings.version;
    
      this.setState({ 
        notifications: notifications,
        textSize: textSize,
        version: version,
        versionItems: versionItems
      });
    }
  }


  handleChange = (event) => {
    console.log(event);
    let newSettings = {};
    newSettings[event.target.id] = event.target.value;
    this.setState(newSettings);
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
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/settings/version').set({
      language: this.state.version.language, 
      code: value, 
      name: event.target.innerHTML
    });
  }

  handleTextSize = (event, value) => {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/settings/textSize').set(value);
  }

  handleColorScheme = (value) => {
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/settings/colorScheme').set(value);
  }

  closeSnackbar = () => {
    this.setState({open: false});
  }

  render() {
    if (!this.state || !this.state.version) return <Layout />;
    else return (
      <Layout className={s.content}>
        <h3>Settings</h3>
        <div>
          <SelectField
            id="version_language"
            floatingLabelText="Default Language to Read"
            value={this.state.version.language}
            onChange={this.handleLanguage}
            maxHeight={250}
          >
            {languageItems}
          </SelectField> <br />
          <SelectField
            id="version_name"
            floatingLabelText="Default Version to Read"
            value={this.state.version.code}
            onChange={this.handleVersion}
            maxHeight={250}
          >
            {this.state.versionItems}
          </SelectField><br />
          <p style={styles.label}><b>Color Scheme</b></p>
          <RaisedButton style={{margin: 12}} label="Normal" onTouchTap={this.handleColorScheme.bind(this, 'normal')} />
          <RaisedButton backgroundColor={'#FBF0D9'} labelColor={'#5F4B32'} label="Sepia" onTouchTap={this.handleColorScheme.bind(this, 'sepia')} />
          <br />
          <p style={styles.label}><b>Text Size ({this.state.textSize*100+'%'})</b></p>
          <p><span style={{fontSize: this.state.textSize*100+'%'}}>Verses will be this size.</span></p>
          <div style={styles.wrapper}>
            <Slider id="textSize" step={.2} min={.8} max={1.6} value={this.state.textSize} onChange={this.handleTextSize}/>
          </div>
        </div>
        <p>
          <br /><br />
        </p>
        <Snackbar
          open={this.state.open}
          message="Plan Updated"
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        />
      </Layout>
    );
  }

}

const languageItems = ['Afrikaans','Albanian','Amharic','Arabic','Chinese','Croatian','Danish','Dutch','English','Esperanto',
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

export default connect(mapStateToProps)(SettingsPage);
