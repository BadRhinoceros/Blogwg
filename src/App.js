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
    isLoading: false,
    searchBar: '',
  }

  onChangeSearchBarHandle = (result) => {
    this.setState({ searchBar: result });
  }

  onLoadingHandle = (isLoading) => {
    this.setState({ isLoading: isLoading })
  }

  deletePostHandle = (id) => {
    $.ajax({
      url: '/deletePost',
      type: 'POST',
      data: {
        postId: id,
      },
    })
    this.setState({isLoading: false});
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
    const { authorized,profileName,userRole,isLoading,searchBar } = this.state;
    return(
      <React.Fragment>
        <Nav authorized={authorized} onChangeSearchBar={this.onChangeSearchBarHandle}/>
        <div className="main-content">
          <div className="feed">
            <Switch>
              <Route exact path="/" component={ (props) =>
                <Posts {...props} searchBar={searchBar} userRole={userRole} onLoading={this.onLoadingHandle} isLoading={isLoading}  deletePostHandle={this.deletePostHandle}/> }
              />
              <Route path="/post_:id" component={ (props) =>
                <FullPost {...props} userRole={userRole} onLoading={this.onLoadingHandle} isLoading={isLoading} onDeletePost={this.deletePostHandle}/> }
              />
              {
                authorized ? <Route path="/profile" component={ (props) => <UserProfile {...props} onLoading={this.onLoadingHandle} isLoading={isLoading} profileName={profileName}/> }/> : null
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
