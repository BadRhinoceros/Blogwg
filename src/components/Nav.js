import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  render() {
    return(
      <div>
        <Link to="/profilelist">Личный кабинет</Link>
        <Link to="/">Лента постов</Link>
      </div>
    )
  }
}

export { Nav }
