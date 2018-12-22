import React, { Component } from 'react';
import $ from 'jquery';

class FormAdd extends Component {
  state = {
    login: '',
    password: '',
    email: '',
    gender: '',
    aut: true,
    signed: false,
  }

  onInputChange = (e) => {
    const { id,value } = e.currentTarget;
    this.setState({ [id]: value });
  }

  onAutBtnClick = (e) => {
    e.preventDefault();
    const { login,password } = this.state;
    $.ajax({
      url: "/authorization",
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
  }

  render() {
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
          <input onChange={this.onInputChange} id="password" placeholder="password" value={password} /><br/>
          <button onClick={this.onAutBtnClick}>Войти</button><button onClick={this.onRegAutBtnClick}>Зарегестрироваться</button>
        </form>
      )
    } else if (!aut) {
      return(
      <form>
        <input onChange={this.onInputChange} id="login" placeholder="login" value={login} /><br/>
        <input onChange={this.onInputChange} id="password" placeholder="password" value={password} /><br/>
        <input onChange={this.onInputChange} id="email" placeholder="email" value={email} /><br/>
        <button onClick={this.onRegBtnClick}>Зарегистрироваться</button><button onClick={this.onRegAutBtnClick}>Есть аккаунт? Войти</button>
      </form>
    )
  }
  }
}

export { FormAdd }
