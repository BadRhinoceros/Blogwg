import React, { Component } from 'react';

import { PostContentEditor } from './PostContentEditor';

import $ from 'jquery';

class CreatePostForm extends Component {

  state = {
    header: '',
    content: '',
    tags: '',
  }

  onContentChangeHandle = (htmlContent) => {
    this.setState({content: htmlContent});
  }

  onSendPost = (result) => {
    console.log(result);
  }

  onInputChange = (e) => {
    const { id,value } = e.currentTarget;
    this.setState({ [id]: value });
  }

  onClickCreatePostBtn = (e) => {
    const {header,content,tags} = this.state;
    if (header && content.trim() && tags.trim()) {
      let tagsArr = tags.split(' ');
      $.ajax({
        url: '/createPost',
        type: 'POST',
        data: {
            header: header,
            subject: content,
            tags: tagsArr,
        }
      });
      alert('Пост опубликован');
    } else {
      e.preventDefault();
      alert('все поля должны быть заполнены');
    }
  }

  onBackClick = (e) => {
    e.preventDefault();
    this.props.onClickBackButton();
  }


  render() {
    const {header,content,tags} = this.state;
    return(
      <form>
        <input onChange={this.onInputChange} id="header" placeholder="Заголовок поста" value={header} /><br/>
        <PostContentEditor onContentChange={this.onContentChangeHandle} />
        <input onChange={this.onInputChange} id="tags" placeholder="Теги поста через пробел" value={tags} /><br/>
        <button onClick={this.onClickCreatePostBtn}>Добавить пост</button>
        <button onClick={this.onBackClick}>Выйти</button>
      </form>
    )
  }
}

export { CreatePostForm }
