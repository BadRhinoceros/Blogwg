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

  componentWillMount = () => {
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
          } else {
            this.setState({ authorized: false });
            alert('Введены неверные данные');
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
        this.setState({ authorized: false });
      }
    })
  }

  render() {
    const { isLoading,login,password,email,profileName,authorizationForm,authorized } = this.state;

    if (isLoading) {
      return(
        <div>
          <p>Загрузка...</p>
        </div>
      )
    } else if (authorized) {
      return(
        <div>
          <p>Привет, {profileName}</p>
          <button onClick={this.onLogoutBtnClick}>Выйти</button>
        </div>
      )
    } else if (authorizationForm) {
      return( //авторизация
        <form>
          <input onChange={this.onInputChange} id="login" placeholder="login"/><br/>
          <input onChange={this.onInputChange} id="password" placeholder="password"/><br/>
          <button onClick={this.onLoginBtnClick}>Войти</button>
          <button onClick={this.onFormModeHandle}>Зарегестрироваться</button>
          </form>
      )
    } else {
      return(
        <form>
        <input onChange={this.onInputChange} id="login" placeholder="login"/><br/>
        <input onChange={this.onInputChange} id="password" placeholder="password"/><br/>
        <input onChange={this.onInputChange} id="email" placeholder="email"/><br/>
        <button onClick={this.onSignInBtnClick}>Зарегестрироваться</button>
        <button onClick={this.onFormModeHandle}>Есть аккаунт? Войти</button>
        </form>
      )
    }
  }

  /*state = {
    login: '',
    password: '',
    email: '',
    gender: '',
    aut: true,
    signed: false,
  }*/

  /*onInputChange = (e) => {
    const { id,value } = e.currentTarget;
    this.setState({ [id]: value });
  }

  onAutBtnClick = (e) => {
    e.preventDefault();
    const { login,password } = this.state;
    $.ajax({
      url: "/authentication",
      type: 'POST',
      data: {
        login: login,
        password: password,
      },
      success: (res) => {
        console.log(res);
        if (res.signed) {
          this.setState({signed: res.signed});
        }
      }
    })
  }

  onRegBtnClick = (e) => {
    e.preventDefault();
    const { login,password,email } = this.state;
    $.ajax({
      url: "/registration",
      type: 'POST',
      data: {
        login: login,
        password: password,
        email: email,
      },
      success: (res) => {
        console.log(res);
      }
    })
  }

  onRegAutBtnClick = (e) => {
    e.preventDefault();
    this.setState({ aut: !this.state.aut });
  }*/

  /*render() {
    const { login,password,email,gender,aut,signed } = this.state;
      if (signed) {
        return (
          <div>
            <p>Привет, {login}.</p>
            <button>Выйти</button>
          </div>
        )
    } else if (aut) {
      return(
        <form>
          <input onChange={this.onInputChange} id="login" placeholder="login" value={login} /><br/>
          <input onChange={this.onInputChange} id="password" type="password" placeholder="password" value={password} /><br/>
          <button onClick={this.onAutBtnClick}>Войти</button><button onClick={this.onRegAutBtnClick}>Зарегестрироваться</button>
        </form>
      )
    } else if (!aut) {
      return(
      <form>
        <input onChange={this.onInputChange} id="login" placeholder="login" value={login} /><br/>
        <input onChange={this.onInputChange} id="password" type="password" placeholder="password" value={password} /><br/>
        <input onChange={this.onInputChange} id="email" placeholder="email" value={email} /><br/>
        <button onClick={this.onRegBtnClick}>Зарегистрироваться</button><button onClick={this.onRegAutBtnClick}>Есть аккаунт? Войти</button>
      </form>
    )
  }
}*/
}

export { FormAdd }
