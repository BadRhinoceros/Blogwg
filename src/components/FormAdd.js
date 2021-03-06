import React, { Component } from 'react';
import $ from 'jquery';

class FormAdd extends Component {
  state = {
    login: '',
    password: '',
    email: '',
    profileName: '',
    authorizationForm: true,
    authorized: false,
    isLoading: false,
  }

  componentWillMount = () => { // добавить это в App, так будет лучше. А profile и authorized передавать через props
    this.setState({isLoading: true});
    $.ajax({
      url: '/checkSession',
      type: 'GET',
      success: (res) => {
        if (res.authorized) {
          this.setState({ authorized: true, profileName: res.profileName, isLoading: false });
          console.log('Хэй, сессия запущена');
        } else {
          this.setState({ authorized: false, isLoading: false });
          console.log('Сессии нет');
        }
      }
    });
  }

  onInputChange = (e) => {
    const { id,value } = e.currentTarget;
    this.setState({ [id]: value });
  }

  onFormModeHandle = (e) => {
    e.preventDefault();
    this.setState({ authorizationForm: !this.state.authorizationForm });
  }

  onSignInBtnClick = (e) => {
    e.preventDefault();
    const { login,password,email } = this.state;

    if (login && password && email) {
      $.ajax({
        url: `/sign?name=${login}&&password=${password}&&email=${email}`,
        type: 'POST',
      });
    } else {
      alert('Поля должны быть заполнены');
    }
  }

  onLoginBtnClick = (e) => {
    e.preventDefault();
    const { login,password } = this.state;

    if (login && password) {
      $.ajax({
        url: `/login?name=${login}&&password=${password}`,
        type: 'POST',
        success: (res) => {
          if (res.authorized) {
            this.setState({ authorized: true, profileName: res.profileName });
            console.log('Успешная авторизация');
            this.props.onFormAction({authorized: true, profileName: res.profileName, userRole: res.userRole});
          } else {
            this.setState({ authorized: false });
            alert('Введены неверные данные');
            this.props.onFormAction({authorized: false, profileName: ''});
            console.log('Вход не произведен');
          }
        }
      })
    } else {
      alert('Поля должны быть заполнены');
    }
  }

  onLogoutBtnClick = () => {
    $.ajax({
      url: '/logout',
      type: 'GET',
      success: (res) => {
        this.setState({ authorized: res.authorized });
      }
    });
    this.props.onFormAction({authorized: false, profileName: '', userRole: ''});
  }

  render() {
    const { isLoading,login,password,email,profileName,authorizationForm,authorized } = this.state;

    if (isLoading) {
      return(
        <div className="form-reg">
          <p>Загрузка...</p>
        </div>
      )
    } else if (authorized) {
      return(
        <div className="form-reg">
          <p>Привет, {profileName}</p>
          <button onClick={this.onLogoutBtnClick} className="form-button">Выйти</button>
        </div>
      )
    } else if (authorizationForm) {
      return(
        <form className="form-reg">
          <input type="text" onChange={this.onInputChange} id="login" placeholder="login"/><br/>
          <input type="password" onChange={this.onInputChange} id="password" placeholder="password"/><br/>
          <button onClick={this.onLoginBtnClick} className="form-button">Войти</button>
          <button onClick={this.onFormModeHandle} className="form-button">Зарегестрироваться</button>
        </form>
      )
    } else {
      return(
        <form className="form-reg">
          <input type="text" onChange={this.onInputChange} id="login" placeholder="login"/><br/>
          <input type="password" onChange={this.onInputChange} id="password" placeholder="password"/><br/>
          <input type="text" onChange={this.onInputChange} id="email" placeholder="email"/><br/>
          <button onClick={this.onSignInBtnClick} className="form-button">Зарегестрироваться</button>
          <button onClick={this.onFormModeHandle} className="form-button">Есть аккаунт?</button>
        </form>
      )
    }
  }
}

export { FormAdd }
