import React, { Component } from 'react';
import { FormAdd } from './components/FormAdd.js';
import { Post } from './components/Post.js';

const data = [
  {
    id: 1,
    header: 'Это заголовок',
    content: 'А это текст поста'
  },

  {
    id: 2,
    header: 'Это заголовок другого поста',
    content: 'А это уже целый контент'
  }
]

class App extends Component {
  state = {
    data: data,
  }

  renderPosts = () => {
      const { data } = this.state;
      let posts = null;

      if (data.length) {
        posts = data.map((item) => {
          return(
            <Post key={item.id} data={item}/>
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
        <div>
          {
            this.renderPosts()
          }
        </div>
        <div>
          <FormAdd />
        </div>
      </div>
    )
  }
}

export default App;
