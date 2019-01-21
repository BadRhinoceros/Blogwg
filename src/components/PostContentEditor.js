import React, { Component } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

class PostContentEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  componentDidMount = () => {
    this.focusEditor();
  }

  onChange = (editorState) => {
    this.setState({ editorState });
    this.props.onContentChange(stateToHTML(this.state.editorState.getCurrentContent()));
  }

  setEditor = (editor) => {
    this.editor = editor;
  }

  focusEditor = () => {
    if (this.editor) {
      this.editor.focus();
    }
  }

  onBoldClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    this.props.onContentChange(stateToHTML(this.state.editorState.getCurrentContent()));
  }
  onItalicClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    this.props.onContentChange(stateToHTML(this.state.editorState.getCurrentContent()));
  }
  onUnderlineClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    this.props.onContentChange(stateToHTML(this.state.editorState.getCurrentContent()));
  }
  onHeaderFourClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-four'));
    this.props.onContentChange(stateToHTML(this.state.editorState.getCurrentContent()));
  }
  onHeaderFiveClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-five'));
    this.props.onContentChange(stateToHTML(this.state.editorState.getCurrentContent()));
  }

  render() {
    return(
      <div id="editor-container" style={styles.editor} onClick={this.focusEditor}>
        <button onClick={this.onHeaderFourClick.bind(this)}>H4</button>
        <button onClick={this.onHeaderFiveClick.bind(this)}>H5</button><br/>
        <button onClick={this.onBoldClick.bind(this)}>Bold</button>
        <button onClick={this.onItalicClick.bind(this)}>Italic</button>
        <button onClick={this.onUnderlineClick.bind(this)}>Underline</button>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
}



export { PostContentEditor }
