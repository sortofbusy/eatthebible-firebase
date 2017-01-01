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
import { chapterNameFromId } from '../../core/bibleRef';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationMore from 'material-ui/svg-icons/navigation/more-vert';

class NotesPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      deleteDialogOpen: false,
      editDialogOpen: false,
      snackbar: '' 
    };
  }

  componentDidMount() {
  }

  buildNoteDetails = (note) => {
    return chapterNameFromId(note.chapterId) + ':' + note.verseId + ', ' + new Date(note.timestamp).toLocaleDateString();
  };

  startDelete = (key) => {
    this.setState({deleteDialogOpen: true, toDelete: key});
  };

  handleDeleteDialog = (ignore, doIt = false) => {
    if (doIt) {
      let chapter = this.props.notes[this.state.toDelete].chapterId;
      let verse = this.props.notes[this.state.toDelete].verseId;
      
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/notes/' + this.state.toDelete).remove();
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/notesByChapter/' + '/' + chapter + '/' + verse + '/' + this.state.toDelete).remove(); 
      
      this.setState({
        snackbar: 'Note deleted',
        deleteDialogOpen: false
      });
    } else 
      this.setState({deleteDialogOpen: false});
  };

  startEdit = (key) => {
    this.setState({editDialogOpen: true, toEdit: key, note: this.props.notes[key].note});
  };

  handleEditCancel = () => {
    this.setState({editDialogOpen: false});
  };

  handleEditSuccess = () => {
    let chapter = this.props.notes[this.state.toEdit].chapterId;
    let verse = this.props.notes[this.state.toEdit].verseId;
   
    let ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
    let updates = {};
    updates['notes/' + this.state.toEdit + '/note'] = this.state.note;
    updates['notesByChapter/' + '/' + chapter + '/' + verse + '/' + this.state.toEdit + '/note'] = this.state.note;
    ref.update(updates); 
    
    this.setState({
      snackbar: 'Note edited',
      editDialogOpen: false
    });
  };

  handleChange = (event, newValue) => {
    this.setState({note: newValue});
  };

  render() {
    return (
      <Layout className={s.content}>
        <h2>Notes</h2>
        <List>
          {this.props.notes && Object.keys(this.props.notes).map( (k) => { 
            let note = this.props.notes[k];
              return <ListItem 
                key={k}
                primaryText={note.note} 
                secondaryText={this.buildNoteDetails(note)} 
                rightIconButton={<IconMenu
                              iconButtonElement={<IconButton><NavigationMore /></IconButton>}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                              targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            >
                              <MenuItem primaryText="Edit" onTouchTap={this.startEdit.bind(this, k)}/>
                              <MenuItem primaryText="Delete" onTouchTap={this.startDelete.bind(this, k)}/>
                            </IconMenu>} /> 
            })
          }
        </List>
        <Dialog
          actions={[<FlatButton label="CANCEL" secondary={true} onTouchTap={this.handleDeleteDialog.bind(false)}/>,
            <FlatButton label="DELETE" primary={true} onTouchTap={this.handleDeleteDialog.bind(true)}/>]}
          modal={false}
          open={this.state.deleteDialogOpen}
          onRequestClose={this.handleDeleteDialog.bind(false)}
        >
          Delete this note permanently?
        </Dialog> 
        <Dialog
          title="Edit Note"
          actions={[<FlatButton label="CANCEL" secondary={true} onTouchTap={this.handleEditCancel}/>,
            <FlatButton label="SAVE CHANGES" primary={true} onTouchTap={this.handleEditSuccess}/>]}
          modal={false}
          open={this.state.editDialogOpen}
          onRequestClose={this.handleEditCancel}
        >
          <TextField
            id="editNote"
            multiLine={true}
            rows={1}
            rowsMax={4}
            value={this.state.note}
            onChange={this.handleChange}
          />
        </Dialog> 
        <Snackbar
          open={this.state.snackbar !== ''}
          message={this.state.snackbar}
          autoHideDuration={3000}
          onRequestClose={this.closeSnackbar}
        /> 
      </Layout>
    );
  }

}

const mapStateToProps = function(store) {
  return {
    notes: store.notes
  };
}

export default connect(mapStateToProps)(NotesPage);
