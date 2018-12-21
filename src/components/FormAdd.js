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

  onBtnClick = (e) => {
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
          </div>
        )
    } else if (aut) {
      return(
        <form>
          <input onChange={this.onInputChange} id="login" placeholder="login" value={login} /><br/>
          <input onChange={this.onInputChange} id="password" placeholder="password" value={password} /><br/>
          <button onClick={this.onBtnClick}>Войти</button><button onClick={this.onRegAutBtnClick}>Зарегестрироваться</button>
        </form>
      )
    } else if (!aut) {
      return(
      <form>
        <input onChange={this.onInputChange} id="login" placeholder="login" value={login} /><br/>
        <input onChange={this.onInputChange} id="password" placeholder="password" value={password} /><br/>
        <input onChange={this.onInputChange} id="email" placeholder="email" value={email} /><br/>
        <button onClick={this.onBtnClick}>Зарегистрироваться</button><button onClick={this.onRegAutBtnClick}>Есть аккаунт? Войти</button>
      </form>
    )
  }
  }
}

export { FormAdd }
