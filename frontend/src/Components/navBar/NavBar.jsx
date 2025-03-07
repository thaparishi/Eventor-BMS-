import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { FaHome, FaInfoCircle, FaConciergeBell, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { BiLogIn, BiLogOut } from "react-icons/bi";

function NavBar({ checkLogin, deleteFun }) {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHidden(currentScrollY > lastScrollY && currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleLogout = () => {
    deleteFun(); // Call the delete function passed from parent to clear cookies
  };

  console.log("checkLogin in NavBar:", checkLogin); // Debugging

  return (
    <nav className={`navbar ${isHidden ? "hidden" : ""}`}>
      <div className="navbar-brand">EVENTOR</div>

      <div className="navbar-toggle" onClick={toggleNav}>
        {isNavOpen ? <FaTimes className="navbar-icon" /> : <FaBars className="navbar-icon" />}
      </div>

      <ul className={`navbar-links ${isNavOpen ? "active" : ""}`}>
        <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}><FaHome className="navbar-icon" /> Home</NavLink></li>
        <li><NavLink to="/banquets" className={({ isActive }) => (isActive ? "active" : "")}><IoPeopleCircleOutline className="navbar-icon" /> Banquets</NavLink></li>
        <li><NavLink to="/gallery" className={({ isActive }) => (isActive ? "active" : "")}><GrGallery className="navbar-icon" /> Gallery</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}><FaInfoCircle className="navbar-icon" /> About Us</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}><FaConciergeBell className="navbar-icon" /> Contact Us</NavLink></li>

        {!checkLogin ? (
          <>
            <li><NavLink to="/register"><BiLogIn className="navbar-icon" /> Register</NavLink></li>
            <li><NavLink to="/login"><FaSignInAlt className="navbar-icon" /> Login</NavLink></li>
          </>
        ) : (
          <li>
            <NavLink to="#" className="link btn-logout" onClick={handleLogout}>
              <BiLogOut className="fa fa-sign-out" aria-hidden="true" /> Logout
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;