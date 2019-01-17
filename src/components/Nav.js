import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';

import '../styles/header.css';

class Nav extends Component {
  state = {
    authorized: false,
  }

  render() {
    const { authorized } = this.props;
    return(
      <header className="header">
        <div className="header-content">
          <div className="logo">Fresh Mind.</div>
          <nav className="nav">
            <ul className="nav-list">
              <li><Link to="/">Главная</Link></li>
              <li>Новости</li>
              <li>Блоги</li>
              <li>Контакты</li>
            </ul>
          </nav>
          <div className="lk-b">
            <div className="search-block">
              <input type="text"placeholder="Поиск"/>
            </div>
            <div className="user-avatar-block">
              { authorized ? <Link to="/profile"><div className="user-avatar"></div></Link> : <div className="user-avatar"></div> }
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export { Nav }
