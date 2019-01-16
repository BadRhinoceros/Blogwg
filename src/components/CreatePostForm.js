import React, { Component } from 'react';

import $ from 'jquery';

class CreatePostForm extends Component {

  state = {
    header: '',
    content: '',
    tags: '',
  }

  onInputChange = (e) => {
    const { id,value } = e.currentTarget;
    this.setState({ [id]: value });
  }

  onClickCreatePostBtn = (e) => {
    e.preventDefault();
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
        <textarea onChange={this.onInputChange} id="content" placeholder="Текст поста" value={content} ></textarea><br/>
        <input onChange={this.onInputChange} id="tags" placeholder="Теги поста через пробел" value={tags} /><br/>
        <button onClick={this.onClickCreatePostBtn}>Добавить пост</button>
        <button onClick={this.onBackClick}>Выйти</button>
      </form>
    )
  }
}

export { CreatePostForm }
