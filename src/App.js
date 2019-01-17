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
    userRole: '',
  }

  deletePostHandle = (id) => {
    console.log("В App поступил запрос на удаление поста c id:"+id);
  }

  componentDidMount = () => {
    $.ajax({
      url: '/checkSession',
      type: 'GET',
      success: (res) => {
        if (res.authorized) {
          console.log('Авторизован');
          this.setState({ authorized: true, profileName: res.profileName, userRole: res.userRole });
        } else {
          this.setState({ authorized: false, profileName: '', userRole: '' });
        }
      }
    })
  }

  onFormActionHandle = (result) => {
    this.setState({ authorized: result.authorized, profileName: result.profileName, userRole: result.userRole });
  }

  render() {
    const { authorized,profileName,userRole } = this.state; // Придумать что-то лучше текущего вывода лк
    return(
      <React.Fragment>
        <Nav authorized={authorized} />
        <div className="main-content">
          <div className="feed">
            <Switch>
              <Route exact path="/" component={ (props) => <Posts {...props} userRole={userRole} deletePostHandle={this.deletePostHandle}/> }/>
              <Route path="/post_:id" component={ (props) => <FullPost {...props} userRole={userRole} onDeletePost={this.deletePostHandle}/> }/>
              {
                authorized ? <Route path="/profile" component={ (props) => <UserProfile {...props} profileName={profileName}/> }/> : null
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
