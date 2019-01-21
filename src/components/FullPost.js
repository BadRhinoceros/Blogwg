import React, { Component } from 'react';
import $ from 'jquery';

class FullPost extends Component {
  state = {
    header: '',
    content: '',
    tags: [],
    comments: [],
    userComment: '',
    isLiked: false,
    numberOfLikes: 0,
    notFound: false,
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    $.ajax({
      url:`/getPostById?id=${id}`,
      type: 'GET',
      success: (res) => {
        if (res.notFound) {
          this.setState({ notFound: true });
        } else {
          this.setState({header: res.header, author: res.author, content: res.content, tags: res.tags, comments: res.comments});
        }
      }
    })
    $.ajax({
      url: '/getPostLikes',
      type: 'POST',
      data: {
        postId: id,
      },
      success: (res) => {
        this.setState({ numberOfLikes: res.numberOfLikes});
      }
    })

    $.ajax({
      url:'/checkLike',
      type: 'POST',
      data: {
        postId: id,
      },
      success: (res) => {
        this.setState({ isLiked: res });
      }
    })
  }

  transformTagsArr = () => {
    const { tags } = this.state;
    let tagsTemplate = null, i = 0;

    if (tags.length) {
      tagsTemplate = tags.map((item, i) => {
        i++;
        return (
          <span className="tag" key={+new Date()+i}>#{item}</span>
        )
      })
    } else {
      tagsTemplate = <p>Без тегов :(</p>
    }

    return tagsTemplate;
  }

  transformCommentsArr = () => {
    const { comments } = this.state;
    let commentsTemplate = null, i = 0;

    if (comments.length) {
      commentsTemplate = comments.map((item) => {
        return(
          <div className="comment" key={item.id}>
            <p>{item.name}</p>
            <p>{item.text}</p>
          </div>
        )
      })
    } else {
      commentsTemplate = <div><p>Комментариев еще нет</p></div>
    }

    return commentsTemplate;
}

  onDeleteLikeBtnClick = () => {
    $.ajax({
      url: '/deleteLike',
      type: "POST",
      data: {
        postId: this.props.match.params.id,
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
        postId: this.props.match.params.id,
      },
      success: (res) => {
          this.setState({isLiked: res.isLiked});
      }
    })
    this.componentDidMount();
  }

  onSendCommentBtnClick = () => {
    const { id } = this.props.match.params;
    const { userComment } = this.state;
    const { userRole } = this.props;
    if(userRole) {
      if (userComment) {
        console.log("Оставить коммент в посте с id:"+id);
        $.ajax({
          url: '/addComment',
          type: 'POST',
          data: {
            postId: id,
            text: userComment,
          }
        });
        this.props.onLoading(true);
      } else {
        alert('Нужно заполнить поле ввода');
      }
    } else {
      alert('Для комментирования постов нужно авторизоваться');
    }
  }

  onInputChange = (e) => {
    const { id,value } = e.currentTarget;
    this.setState({ [id]: value });
  }

  onDeletePostBtnClick = () => {
    const { id } = this.props.match.params;
    this.props.onDeletePost(id);
  }

  render() {
    const { header,author,content,notFound,tags,userComment,isLiked,numberOfLikes} = this.state;
    const { userRole } = this.props;

    if (notFound) {
      return(
        <div>
          <p>Такого поста не существует</p>
        </div>
      )
    } else {
      return(
        <div className="post-block">
          {
            userRole == 'admin' ? <button onClick={this.onDeletePostBtnClick}>Удалить пост</button> : null
          }
          <h3>{header}</h3>
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
          <hr/>
          <div className="comments-block">
            {
              this.transformCommentsArr()
            }
          </div>
          <hr/>
          <div className="commenting-block">
            <p>Оставьте свой комментарий:</p>
            <textarea onChange={this.onInputChange} id="userComment" value={userComment} placeholder="Комментарий..."></textarea><br/>
            <button onClick={this.onSendCommentBtnClick}>Отправить</button>
          </div>
        </div>
      )
    }
  }
}

export { FullPost }
