import React, { Component } from 'react';
import { Post } from './Post';
import $ from 'jquery';

class Posts extends Component {
  state = {
    data: '',
  }

  componentDidMount = () => {
      $.ajax({
        url:'/getPosts',
        type:'GET',
        success: (res) => {
          //console.log(res);
          this.setState({data: res});
        }
      })
  }

  renderPosts = () => {
    const { data } = this.state;
    //const { getPostId } = this.props;
    const { userRole,deletePostHandle } = this.props;
    let posts = null;

    if (data.length) {
      posts = data.map((item) => {
        return(
          <Post key={item.id} data={item} userRole={userRole} onDeletePost={deletePostHandle}/>
        )
      })
    } else {
      posts = <p>Постов нет.</p>
    }

    return posts;
  }

  render() {
    return(
      <div>
        {this.renderPosts()}
      </div>
    )
  }
}

export { Posts }
