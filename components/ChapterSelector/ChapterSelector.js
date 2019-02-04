
import React, { PropTypes } from 'react';
import {books, chapterNumFromChapterId, bookIdFromChapterId, chapterIdFromBookNumAndChapterNum} from '../../core/bibleRef';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class ChapterSelector extends React.Component {
  static propTypes = {
    label: React.PropTypes.string,
    chapterId: React.PropTypes.number,
    _callback: React.PropTypes.func,
    greaterThan: React.PropTypes.number,
    lessThan: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    
    let bookId = bookIdFromChapterId(props.chapterId);
    let chapterNum = chapterNumFromChapterId(props.chapterId);
    let chapterItems = (props.chapterId) ? books[bookId].chapters.map(function(a, index) {
          return <MenuItem key={index+1} value={index+1} primaryText={index+1} />;
        }) : null;
    this.state = { 
      bookList: books.map(function(a) {return a.name;}),
      bookId: bookId,
      chapterNum: chapterNum,
      chapterItems: chapterItems
    };
  }

  handleBook = (event, bookIndex, value) => {
    let chapters = [];
    books[bookIndex].chapters.map(function(a, index) {
      chapters.push(<MenuItem key={index+1} value={index+1} primaryText={index+1} />)
    });
    
    if (this.props._callback && this.state.chapterNum) 
      this.props._callback(chapterIdFromBookNumAndChapterNum(value, this.state.chapterNum));
    
    this.setState({
      bookId: value,
      chapterItems: chapters 
    });
  }

  handleChapter = (event, index) => {
    let chapterNum = index + 1;
    if (this.props._callback) this.props._callback(chapterIdFromBookNumAndChapterNum(this.state.bookId, chapterNum));
    this.setState({
      chapterNum: chapterNum
    });
  }


  render() {
    let bookLabel = (this.props.label) ? this.props.label + ' Book' : 'Book';
    let greaterThanBook, greaterThanChapter, lessThanBook, lessThanChapter = null;
    let bookError, chapterError = null;
    
    if (this.props.lessThan) {
      lessThanBook = bookIdFromChapterId(this.props.lessThan);
      lessThanChapter = chapterNumFromChapterId(this.props.lessThan);
      if (lessThanBook < this.state.bookId) bookError = 'Invalid range';
      if (lessThanBook === this.state.bookId && lessThanChapter < this.state.chapterNum) chapterError = 'Invalid range';
    }
    if (this.props.greaterThan) {
      greaterThanBook = bookIdFromChapterId(this.props.greaterThan);
      greaterThanChapter = chapterNumFromChapterId(this.props.greaterThan);
      if (greaterThanBook > this.state.bookId) bookError = 'Invalid range';
      if (greaterThanBook === this.state.bookId && greaterThanChapter > this.state.chapterNum) chapterError = 'Invalid range';
    }
    
    return (
      <div>
        <SelectField
          floatingLabelText={bookLabel}
          value={this.state.bookId}
          onChange={this.handleBook}
          style={{width: 150, marginRight: 16}}
          maxHeight={250}
          errorText={bookError}
        >
          {bookItems.map(function(a) { return a;})}
        </SelectField>
        <SelectField
          floatingLabelText="Chapter"
          value={this.state.chapterNum}
          onChange={this.handleChapter}
          style={{width: 90}}
          maxHeight={250}
          errorText={chapterError}
        >
          {(this.state.bookId !== null) && this.state.chapterItems.map(function(a) { return a;})}
        </SelectField>
      </div>
    );
  }

}

const bookItems = books.map(function(a, index) {return <MenuItem key={index} value={index} primaryText={a.name} />;});

export default ChapterSelector;
