import React, { Component } from 'react';

class Post extends Component {
  onHeaderClick = () => {
    console.log(`Клик на пост с id: ${this.props.data.id}`);
  }
  render() {
    const { header,content } = this.props.data;
    return(
      <div>
        <h3 onClick={this.onHeaderClick}>{header}</h3>
        <p>{content}</p>
      </div>
    )
  }
}

export { Post }
