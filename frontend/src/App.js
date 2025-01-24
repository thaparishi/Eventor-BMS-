import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";
import NavBar from "./Components/navBar/NavBar";
import Footer from "./Components/navBar/Footer";
import Home from "./Components/Pages/Home";
import About from "./Components/Pages/About";
import Banquet from "./Components/Pages/Banquets";
import Gallery from "./Components/Pages/Gallery";
import Contact from "./Components/Pages/Contact";
import Register from "./Components/login-register/Register";
import Login from "./Components/login-register/Login";
import ForgetPass from "./Components/login-register/ForgetPass";

function App() {
  const [checkLogin, setCheckLogin] = useState(false);
  const [userId, setUserid] = useState(null);

  const getCookies = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/checkLoginCookie");
      setCheckLogin(response.data.success);
      setUserid(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLoginCookie = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/deleteLoginCookies");
      setCheckLogin(response.data.success);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCookies();
  }, []);

  return (
    <Router>
      <div>
        <NavBar checkLogin={checkLogin} deleteFun={deleteLoginCookie} />
        <Routes>
          <Route path="/" element={<Home checkLogin={checkLogin} />} />
          <Route path="/about" element={<About />} />
          <Route path="/banquets" element={<Banquet />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* If user is logged in */}
          {checkLogin && (
            <>
            </>
          )}

          {/* If user is NOT logged in */}
          {!checkLogin && (
            <>
              <Route path="/forgetPass" element={<ForgetPass />} />
            </>
          )}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
