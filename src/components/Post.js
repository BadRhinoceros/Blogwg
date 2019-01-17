import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Post extends Component {


  transformTagsArr = () => {
    const { tags } = this.props.data;

    let tagsTemplate = null, i = 0;
    if (tags.length) {
      tagsTemplate = tags.map((item, i) => {
        i++;
        return (
          <span className="tag" key={+new Date()+i}>{item}</span>
        )
      })
    } else {
      tagsTemplate = <p>Без тегов :(</p>
    }

    return tagsTemplate;
  }

  onHeaderClick= () => {
    const { id } = this.props.data;
    console.log(`Нажатие на пост с ID = ${id}`);
  }

  onDeletePostBtnClick = () => {
    const { id } = this.props.data;
    console.log('Админ хочет удалить пост с id:'+id);
    this.props.onDeletePost(id);
  }

  render() {
    const { id,header,content } = this.props.data;
    //const { getPostId } = this.props;
    const { userRole } = this.props;
    return(
      <div className="post-block">
        {
          userRole == 'admin' ? <button onClick={this.onDeletePostBtnClick}>Удалить пост</button> : null
        }
        <h3 onClick={this.onHeaderClick}><Link to={"/post_"+id}>{header}</Link></h3>
        <p>{content}</p>
        <div className="tags-block">
          {
            this.transformTagsArr()
          }
        </div>
      </div>
    )
  }
}


export { Post }
