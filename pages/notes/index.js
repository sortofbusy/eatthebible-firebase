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

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
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
    return chapterNameFromId(note.chapterId) + ':' + note.verse.ref + ', ' + new Date(note.timestamp).toLocaleDateString();
  };

  closeSnackbar = () => {
    this.setState({snackbar: ''});
  };

  startDelete = (key) => {
    this.setState({deleteDialogOpen: true, toDelete: key});
  };

  handleDeleteCancel = () => {
    this.setState({deleteDialogOpen: false});
  };

  handleDeleteSuccess = () => {
    let chapter = this.props.notes[this.state.toDelete].chapterId;
    let verse = this.props.notes[this.state.toDelete].verse.ref;
    
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/notes/' + this.state.toDelete).remove();
    firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/notesByChapter/' + '/' + chapter + '/' + verse + '/' + this.state.toDelete).remove(); 
    
    this.setState({
      snackbar: 'Note deleted',
      deleteDialogOpen: false
    });
  };

  startEdit = (key) => {
    this.setState({editDialogOpen: true, toEdit: key, note: this.props.notes[key].note});
  };

  handleEditCancel = () => {
    this.setState({editDialogOpen: false});
  };

  handleEditSuccess = () => {
    let chapter = this.props.notes[this.state.toEdit].chapterId;
    let verse = this.props.notes[this.state.toEdit].verse.ref;
   
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
        
          {this.props.notes && Object.keys(this.props.notes).map( (k) => { 
            let note = this.props.notes[k];
              return (
                <Card key={k} style={{marginBottom: 8}}> 
                  <CardHeader
                    title={note.note} 
                    subtitle={this.buildNoteDetails(note)} 
                    actAsExpander={true}
                    showExpandableButton={true}
                  />
                  <CardText expandable={true}>
                    <b>{chapterNameFromId(note.chapterId) + ':' + note.verse.ref}</b><br />
                    {note.verse.text}
                    <CardActions>
                      <FlatButton label="Edit" onTouchTap={this.startEdit.bind(this, k)}/>
                      <FlatButton label="Delete" onTouchTap={this.startDelete.bind(this, k)}/>
                    </CardActions>
                  </CardText>
                </Card>
              ); 
            })
          }
        
        <Dialog
          actions={[<FlatButton label="CANCEL" primary={true} onTouchTap={this.handleDeleteCancel}/>,
            <FlatButton label="DELETE" primary={true} onTouchTap={this.handleDeleteSuccess}/>]}
          modal={false}
          open={this.state.deleteDialogOpen}
          onRequestClose={this.handleDeleteCancel}
        >
          Delete this note permanently?
        </Dialog> 
        <Dialog
          title="Edit Note"
          actions={[<FlatButton label="CANCEL" primary={true} onTouchTap={this.handleEditCancel}/>,
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
