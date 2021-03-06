import React, { Component } from 'react';

import { CreatePostForm } from './CreatePostForm';

import $ from 'jquery';

class UserProfile extends Component {

  state = {
    createPost: false,
  }

  onClickCreatePost = () => {
    const { createPost } = this.state;
    this.setState({ createPost: !createPost });
  }

  render() {
    const { createPost } = this.state;
    const { profileName } = this.props;
    return(
      <div className="userProfile-block">
        <p>Личный кабинет пользователя {profileName}</p>
        {
          this.props.isLoading && <div><p>Загрузка...</p></div>
        }
        {
          !createPost && <button onClick={this.onClickCreatePost}>Создать пост</button>
        }
        {
          createPost && <CreatePostForm onLoading={this.onLoading} onClickBackButton={this.onClickCreatePost}/>
        }
      </div>
    )
  }
}

export { UserProfile }
