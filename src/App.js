import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';

import { Nav } from './components/Nav';
import { FormAdd } from './components/FormAdd';
import { Posts } from './components/Posts';
import { FullPost } from './components/FullPost';
import { UserProfile } from './components/UserProfile';

import $ from 'jquery';

import './styles/main.css';

class App extends Component {
  state = {
    authorized: false,
    profileName: '',
  }

  componentDidMount = () => {
    $.ajax({
      url: '/checkSession',
      type: 'GET',
      success: (res) => {
        if (res.authorized) {
          this.setState({ authorized: true, profileName: res.profileName });
        } else {
          this.setState({ authorized: false, profileName: '' });
        }
      }
    })
  }

  onFormActionHandle = (result) => {
    this.setState({ authorized: result.authorized, profileName: result.profileName });
  }

  render() {
    const { authorized,profileName } = this.state; // Придумать что-то лучше текущего вывода лк
    return(
      <React.Fragment>
        <Nav authorized={authorized} />
        <div className="main-content">
          <div className="feed">
            <Switch>
              <Route exact path="/" component={ (props) => <Posts {...props}/>}/>
              <Route path="/post_:id" component={ (props) => <FullPost {...props}/>}/>
              {
                authorized ? <Route path="/profile" component={ (props) => <UserProfile {...props} profileName={profileName}/>}/> : null
              }
              <Route component={ () => <p>404</p> }/>
            </Switch>
          </div>
          <div className="registr">
            <FormAdd onFormAction={this.onFormActionHandle}/>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default App;
