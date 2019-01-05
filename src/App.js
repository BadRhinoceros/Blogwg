import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';

import { Nav } from './components/Nav';
import { FormAdd } from './components/FormAdd';
import { Posts } from './components/Posts';
import { FullPost } from './components/FullPost';

import $ from 'jquery';

class App extends Component {

  render() {
    return(
      <div>
        <Nav />
        <Switch>
          <Route exact path="/" component={ (props) => <Posts {...props}/>}/>
          <Route path="/post_:id" component={ (props) => <FullPost {...props} /> }/>
          <Route component={ () => <p>404</p> }/>
        </Switch>
        <FormAdd />
      </div>
    )
  }
}

export default App;
