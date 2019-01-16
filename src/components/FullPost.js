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
    console.log(id);
    $.ajax({
      url:`/getPostById?id=${id}`,
      type: 'GET',
      success: (res) => {
        console.log(res);
        if (res.notFound) {
          this.setState({ notFound: true });
        } else {
          this.setState({header: res.header, content: res.content, tags: res.tags});
        }
      }
    })
  }

  render() {
    const { header,content,notFound,tags} = this.state;

    if (notFound) {
      return(
        <div>
          <p>Такого поста не существует</p>
        </div>
      )
    } else {
      return(
        <div className="post-block">
          <h3>{header}</h3>
          <p>{content}</p>
        </div>
      )
    }
  }
}

export { FullPost }
