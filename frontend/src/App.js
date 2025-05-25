import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "./Components/navBar/NavBar.jsx";
import Footer from "./Components/navBar/Footer.jsx";
import Home from "./Components/Pages/Home.jsx";
import About from "./Components/Pages/About.jsx";
import Gallery from "./Components/Pages/Gallery.jsx";
import Contact from "./Components/Pages/Contact.jsx";
import Register from "./Components/login-register/Register.jsx";
import Login from "./Components/login-register/Login.jsx";
import ForgetPass from "./Components/login-register/ForgetPass.jsx";
import Pagenf from "./Components/Pages/Pagenf.jsx";
import DisplayBanquet from "./Components/Banquet/displayBanquet.jsx";
import DisplayMenu from "./Components/Banquet/displayMenu.jsx";
import BookBanquet from "./Components/Banquet/bookBanquet.jsx";
import DBanquet from "./Components/Pages/Dbanquet.jsx";
import Menu from "./Components/Pages/menu.jsx";
import { CreateBanquet, ChangePassword, Blog } from "./Components/index.js";
import PaymentSuccess from "./Components/Pages/PaymentSuccess.jsx";
import Profile from "./Components/Pages/Profile.jsx";
import ReviewPage from "./Components/Pages/ReviewPage.jsx";

function App() {
  const [checkLogin, setCheckLogin] = useState(false);
  const [userId, setUserid] = useState(null);

  const getCookies = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/checkLoginCookie", {
        withCredentials: true,
      });
      setCheckLogin(response.data.success);
      setUserid(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLoginCookie = async () => {
    try {
      const response = await axios.get("/api/deleteLoginCookies", {
        withCredentials: true
      });
      setCheckLogin(false);
      setUserid(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    setCheckLogin(true);
  };

  useEffect(() => {
    getCookies();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar checkLogin={checkLogin} deleteFun={deleteLoginCookie} />
        <Routes>
          <Route path="/" element={<Home checkLogin={checkLogin} />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/dbanquet" element={<DBanquet/>} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/booking" element={<PaymentSuccess />} />
          <Route path="/booking/:bookingId" element={<PaymentSuccess />} />
          
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/changePassword/:id" element={<ChangePassword />} />

          {checkLogin && (
            <>
              <Route path="/banquets" element={<DisplayBanquet />} />
              
              <Route path="/bookBanquet/:banquetId/:banquetName/:banquetPrice" element={<BookBanquet />} />
              
              <Route path="/createBanquet" element={<CreateBanquet />} />
              <Route path="/menu/:token" element={<Menu />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}

          {!checkLogin && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/forgetPass" element={<ForgetPass />} />
              <Route path="/changePassword/:id" element={<ChangePassword />} />
            </>
          )}

          <Route path="/DisplayMenu/:banquetId/:token/:banquetName/:banquetPrice" element={<DisplayMenu />} />
          
          <Route path="*" element={<Pagenf />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;