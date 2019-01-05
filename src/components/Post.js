import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Post extends Component {

  onHeaderClick= () => {
    const { id } = this.props.data;
    console.log(`Нажатие на пост с ID = ${id}`);
  }

  render() {
    const { id,header,content } = this.props.data;
    const { getPostId } = this.props;
    return(
      <div>
        <h3 onClick={this.onHeaderClick}><Link to={"/post_"+id}>{header}</Link></h3>
        <p>{content}</p>
      </div>
    )
  }
}

export { Post }
