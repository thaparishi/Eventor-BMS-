import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import { FaHome, FaInfoCircle, FaConciergeBell, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

function NavBar() {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true); // Hide navbar when scrolling down
      } else {
        setIsHidden(false); // Show navbar when scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isHidden ? 'hidden' : ''}`}>
      <div className="navbar-brand">EVENTOR</div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaHome className="navbar-icon" />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaInfoCircle className="navbar-icon" />
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/banquets" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaConciergeBell className="navbar-icon" />
            Banquets
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaUserPlus className="navbar-icon" />
            Register
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaSignInAlt className="navbar-icon" />
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
