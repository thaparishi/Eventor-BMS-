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
import Menu from "./Components/Pages/menu.jsx";
import DBanquet from "./Components/Pages/Dbanquet.jsx";
import { CreateBanquet, ChangePassword } from "./Components/index.js";

function App() {
  const [checkLogin, setCheckLogin] = useState(false);
  const [userId, setUserid] = useState(null);

  const getCookies = async () => {
    try {
      const response = await axios.get("/api/checkLoginCookie");
      setCheckLogin(response.data.success);
      setUserid(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLoginCookie = async () => {
    try {
      await axios.get("/api/deleteLoginCookies");
      setCheckLogin(false); // Immediately set checkLogin to false
      console.log("checkLogin updated to false in App.js"); // Debugging
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    if (!checkLogin) { // Only call getCookies if checkLogin is false
      getCookies();
    }
  }, [checkLogin]); // Re-run when checkLogin changes
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar checkLogin={checkLogin} deleteFun={deleteLoginCookie} />
        <Routes>
          <Route path="/" element={<Home checkLogin={checkLogin} />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/changePassword/:id" element={<ChangePassword />} />

          {/* if user is loged in then only this route exists*/}
          {checkLogin && (
            <>
              <Route
                path="/banquet/:token"
                element={<DisplayBanquet userId={userId} />}
              ></Route>
              <Route path="/createBanquet" element={<CreateBanquet />} />
              <Route path="/bookBanquet" element={<BookBanquet />} />  
              <Route path="/menu/:token" element={<Menu />}></Route>
            </>
          )}

          {/* If user is not loged in then only this route exists */}
          {!checkLogin && (
            <> 
            <Route path="/banquets" element={<DBanquet />} /> 
              <Route path="/register" element={<Register />}></Route>
              <Route path="/forgetPass" element={<ForgetPass />}></Route>
              <Route
                path="/changePassword/:id"
                element={<ChangePassword />}
              ></Route>
            </>
          )}

          <Route
            path="/DisplayMenu/:userId/:token/:banquetName/:banquetPrice"
            element={<DisplayMenu/>}
          ></Route>
          <Route path="*" element={<Pagenf />}/>
          </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;