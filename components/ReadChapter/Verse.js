/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import store from '../../core/store';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { chapterNameFromId } from '../../core/bibleRef';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import EditorEdit from 'material-ui/svg-icons/editor/mode-edit';

class Verse extends React.Component {
  state = {
    open: false,
    snackbar: ''
  };

  closeSnackbar = () => {
	  this.setState({
	    snackbar: '',
	  });
	};

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleChange = (event, newValue) => {
  	this.setState({note: newValue});
  };

  handleSave = () => {
  	let timeNow = Date.now();
  	let newNote = {
  		chapterId: this.props.chapterId,
  		verse: this.props.verse,
  		note: this.state.note,
  		timestamp: timeNow
  	};

  	let ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
  	
  	let newNoteKey = ref.child('notes').push().key;

  	let updates = {};
  	updates['notes/' + newNoteKey] = newNote;
  	updates['notesByChapter/' + this.props.chapterId + '/' + this.props.verse.ref + '/' + newNoteKey] = newNote;
  	ref.update(updates);
  	this.setState({open: false, note: '', snackbar: 'Note saved'});
  }

  render() {
    const actions = [
      <FlatButton
        label="CANCEL"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="SAVE"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSave}
      />,
    ];

    if (!this.props.verse) return null;
    let editStyle = {color: this.props.muiTheme.palette.accent2Color};
    if (this.props.notes) editStyle = {color: '#2196F3'};
    return (
    	<div key={this.props.verse.ref} style={{layout: 'flex'}}>
    		<sup>{this.props.verse.ref} </sup>
    		<span dangerouslySetInnerHTML={{__html: this.props.verse.text}} />
        {this.props.editMode && <EditorEdit style={{...editStyle,...{ cursor: 'pointer'}}} onTouchTap={this.handleOpen} />}
    		{this.props.editMode && 
          <Dialog
	          title={'Notes on Verse ' + this.props.verse.ref}
	          actions={actions}
	          modal={false}
	          open={this.state.open}
	          onRequestClose={this.handleClose}
	          autoScrollBodyContent={(typeof(this.props.notes) !== 'undefined')}
	        >
	        	<TextField
        	      hintText="Enter a new note"
        	      multiLine={true}
        	      rows={1}
        	      rowsMax={4}
        	      value={this.state.note}
        	      onChange={this.handleChange}
        	    />
        	    <List>
	        		{this.props.notes && Object.keys(this.props.notes).map( (k)=> <ListItem key={k} primaryText={this.props.notes[k].note} secondaryText={ new Date(this.props.notes[k].timestamp).toLocaleDateString() } /> )}
	        	</List>
	        </Dialog>
        }
        {this.props.editMode &&
	        <Snackbar
              open={this.state.snackbar !== ''}
              message={this.state.snackbar}
              autoHideDuration={4000}
              onRequestClose={this.closeSnackbar}
          />
        }
    	</div>
    );
  }

}

export default muiThemeable()(Verse);