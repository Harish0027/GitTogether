import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({setIsLogin}) => {
  const [menuActive, setMenuActive] = useState(false);

  const handleMenuClick = () => {
    setMenuActive(!menuActive); // Toggle the menu visibility
  };

  return (
    <div className='navbar'>
      <div className="navbar-leftCompo">
        <div className='logo'>
          <p className="logo-header">giTogether</p>
        </div>
        {/* Render the left list based on menuActive */}
        <ul className={`navbar-left-list ${menuActive ? 'active' : ''}`}>
          <li className='bold about-us'>About us</li>
          <li className='bold'>Contact</li>
          <li className='bold'>Download</li>
        </ul>
      </div>
      <div className='navbar-rightCompo'>
        {/* Only render the right list when the menu is active */}
        <ul className={`navbar-right-list ${menuActive ? 'active' : ''}`}>
          <li onClick={()=>{setIsLogin(true)}} className='bold log-in'>Log in</li>
        </ul>
      </div>
      {/* Hamburger menu */}
      <div className="menu-icon" onClick={handleMenuClick}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  );
};

export default Navbar;
