import React, { Component } from 'react';
import { Post } from './Post';
import $ from 'jquery';

class Posts extends Component {
  state = {
    data: '',
  }

  componentDidMount = () => {
    const { searchBar } = this.props;
    if (!searchBar) {
      $.ajax({
        url:'/getPosts',
        type:'GET',
        success: (res) => {
          this.setState({data: res});
        }
      })
    } else {
      $.ajax({
        url:'/fingPost',
        type: 'POST',
        data: {
          postHeader: searchBar,
        },
        success: (res) => {
          this.setState({data: res});
        }
      })
    }
  }

  renderPosts = () => {
    const { data } = this.state;
    const { userRole,deletePostHandle } = this.props;
    let posts = null;
    if (data.length) {
      data.reverse();
      posts = data.map((item) => {
        return(
          <Post key={item.id} data={item} userRole={userRole} onLoading={this.props.onLoading} onDeletePost={deletePostHandle}/>
        )
      })
    } else {
      posts = <p>Посты не загружены.</p>
    }

    return posts;
  }

  render() {
      return(
        <React.Fragment>
          {this.renderPosts()}
        </React.Fragment>
      )
  }
}

export { Posts }
