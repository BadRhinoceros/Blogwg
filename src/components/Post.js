import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';

class Post extends Component {

  state = {
    isLiked: false,
    numberOfLikes: 0,
  }

  transformTagsArr = () => {
    const { tags } = this.props.data;

    let tagsTemplate = null, i = 0;
    if (tags.length) {
      tagsTemplate = tags.map((item, i) => {
        return (
          <span className="tag" key={+new Date()+i+10}>#{item}</span>
        )
      })
    } else {
      tagsTemplate = <p>Без тегов :(</p>
    }

    return tagsTemplate;
  }

  componentDidMount = () => {
    $.ajax({
      url: '/getPostLikes',
      type: 'POST',
      data: {
        postId: this.props.data.id
      },
      success: (res) => {
        this.setState({ numberOfLikes: res.numberOfLikes});
      }
    })

    $.ajax({
      url:'/checkLike',
      type: 'POST',
      data: {
        postId: this.props.data.id,
      },
      success: (res) => {
        this.setState({ isLiked: res });
      }
    })
  }


  onDeletePostBtnClick = () => {
    const { id } = this.props.data;
    this.props.onDeletePost(id);
    this.props.onLoading(true);
  }

  onDeleteLikeBtnClick = () => {
    $.ajax({
      url: '/deleteLike',
      type: "POST",
      data: {
        postId: this.props.data.id,
      },
      success: (res) => {
        this.setState({isLiked: res.isLiked});
      }
    })
    this.componentDidMount();
  }

  onAddLikeBtnClick = () => {
    $.ajax({
      url: '/addLike',
      type: "POST",
      data: {
        postId: this.props.data.id,
      },
      success: (res) => {
        this.setState({isLiked: res.isLiked});
      }
    })
    this.componentDidMount();
  }

  render() {
    const { isLiked,numberOfLikes } = this.state;
    const { id,header,content,author } = this.props.data;
    const { userRole } = this.props;
    return(
      <div className="post-block">
        {
          userRole == 'admin' ? <button onClick={this.onDeletePostBtnClick}>Удалить пост</button> : null
        }
        <h3><Link to={"/post_"+id}>{header}</Link></h3>
        <p className="author">Автор: {author}</p>
        <div className="content-block" dangerouslySetInnerHTML={{__html:content}}></div>
        <div className="tags-block">
          <p>Теги:</p>
          {
            this.transformTagsArr()
          }
        </div>
        <hr/>
        <div className="info-block">
          <React.Fragment>
            {
              userRole && isLiked && <button className="deleteLike" onClick={this.onDeleteLikeBtnClick}><img src="liked.png" alt=""/></button>
            }
            {
              userRole && !isLiked && <button className="addLike" onClick={this.onAddLikeBtnClick}><img src="like.png" alt=""/></button>
            }
            <p>Рейтинг: {numberOfLikes}</p>
          </React.Fragment>
        </div>
      </div>
    )
  }
}


export { Post }
