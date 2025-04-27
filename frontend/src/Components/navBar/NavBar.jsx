import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { FaHome, FaInfoCircle, FaConciergeBell, FaSignInAlt, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { BiLogIn, BiLogOut } from "react-icons/bi";

function NavBar({ checkLogin, deleteFun }) {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHidden(currentScrollY > lastScrollY && currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    setShowDropdown(false);
    deleteFun(); // Call the delete function passed from parent to clear cookies
  };

  return (
    <nav className={`navbar ${isHidden ? "hidden" : ""}`}>
      <div className="navbar-brand">EVENTOR</div>

      <div className="navbar-toggle" onClick={toggleNav}>
        {isNavOpen ? <FaTimes className="navbar-icon" /> : <FaBars className="navbar-icon" />}
      </div>

      <ul className={`navbar-links ${isNavOpen ? "active" : ""}`}>
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}><FaHome className="navbar-icon" /> Home</NavLink></li>
        <li><NavLink to="/dbanquet" className={({ isActive }) => (isActive ? "active" : "")}><IoPeopleCircleOutline className="navbar-icon" /> Banquets</NavLink></li>
        <li><NavLink to="/blogs" className={({ isActive }) => (isActive ? "active" : "")}><IoPeopleCircleOutline className="navbar-icon" /> Blogs</NavLink></li>
        <li><NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}><GrGallery className="navbar-icon" /> Gallery</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}><FaInfoCircle className="navbar-icon" /> About Us</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}><FaConciergeBell className="navbar-icon" /> Contact Us</NavLink></li>

        {!checkLogin ? (
          <>
            <li><NavLink to="/register"><BiLogIn className="navbar-icon" /> Register</NavLink></li>
            <li><NavLink to="/login"><FaSignInAlt className="navbar-icon" /> Login</NavLink></li>
          </>
        ) : (
          <li className="dropdown-container" ref={dropdownRef}>
            <button className="user-menu-btn" onClick={toggleDropdown}>
              <FaUserCircle className="navbar-icon" /> My Account <span className="dropdown-arrow">▼</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <NavLink to="/profile" onClick={() => setShowDropdown(false)}>
                  <FaUserCircle /> Profile
                </NavLink>
                <button onClick={handleLogout} className="dropdown-item">
                  <BiLogOut /> Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;