import React, { Component } from 'react';
import $ from 'jquery';

class FullPost extends Component {
  state = {
    header: '',
    content: '',
    tags: [],
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
          this.setState({header: res.header, content: res.content, tags: res.tags});
        }
      }
    })
  }

  onDeletePostBtnClick = () => {
    const { id } = this.props.match.params;
    console.log('Админ хочет удалить пост с id:'+id);
    this.props.onDeletePost(id);
  }

  render() {
    const { header,content,notFound,tags} = this.state;
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
          <p>{content}</p>
        </div>
      )
    }
  }
}

export { FullPost }
