
import React from 'react';
import './Nav.css';

//asset imports
import video from '../../loginAssets/miku_vid.mp4'
import logo from '../../loginAssets/doge.png'


const Nav_Home = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="AncesTREE" />
      </div>
      <ul className="navbar__links">
        <div>
          <li><a href='/'>AncesTREE</a></li> 
        </div>
        <li><a href="/">Home</a></li>
        <li><a href="/search">Search</a></li>
        <li><a href="/records">Records</a></li>
        <li><a href="/activities">Activities</a></li>
        <li><a href="/memories">Memories</a></li>
        <li><a href="/help">FAQs</a></li>
      </ul>
      <div className="navbar__search">
        <input type="text" placeholder="Search" />
      </div>
      <div className="navbar__buttons">
      <a href='/login'><button className="navbar__button" >Sign In</button></a>
        <button className="navbar__button navbar__button--primary">Sign Up</button>
      </div>
    </nav>
  );
};

export default Nav_Home;
