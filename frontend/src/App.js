import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import NavBar from "./Components/navBar/NavBar";
import Footer from "./Components/navBar/Footer";
import Home from "./Components/Pages/Home";
import About from "./Components/Pages/About";
import Gallery from "./Components/Pages/Gallery";
import Contact from "./Components/Pages/Contact";
import Register from "./Components/login-register/Register";
import Login from "./Components/login-register/Login";
import ForgetPass from "./Components/login-register/ForgetPass";
import Pagenf from "./Components/Pages/Pagenf";
import DisplayBanquet from "./Components/Banquet/displayBanquet";
import Banquet from "./Components/Banquet/createBanquet";
import Menu from "./Components/Pages/menu";
import { CreateBanquet } from "./Components";
import { ChangePassword } from "./Components";

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
      const response = await axios.get("/api/deleteLoginCookies");
      setCheckLogin(response.data.success);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCookies();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
      <NavBar checkLogin={checkLogin} deleteFun={deleteLoginCookie} />
        <Routes>

        <Route
            path="/"
            element={<Home checkLogin={checkLogin} />}
          ></Route>

          <Route path="/about" element={<About />} />
          <Route path="/banquets" element={<DisplayBanquet />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

{/* if user is loged in then only this route exists*/}
          {checkLogin && (
            <>
              <Route
                path="/banquet/:token"
                element={<DisplayBanquet userId={userId} />}
              ></Route>
              <Route path="/createBanquet" element={<CreateBanquet />}></Route>
              <Route path="/menu/:token" element={<Menu />}></Route>
            </>
          )}

          {/* If user is not loged in then only this route exists */}
          {!checkLogin && (
            <>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/forgetPass" element={<ForgetPass />}></Route>
              <Route
                path="/changePassword/:id"
                element={<ChangePassword />}
              ></Route>
            </>
          )}
          <Route path="*" element={<Pagenf />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
