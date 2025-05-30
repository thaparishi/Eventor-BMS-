import React, { useEffect, useState } from "react";

import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./login-register.css";

const Login = ({onLogin}) => {
  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    sucess: false,
    unSucess: false,
  });

  const [userAuth, setUserAuth] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const name = e.target.name;
    const password = e.target.value;
    setUserAuth({ ...userAuth, [name]: password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", userAuth, {
        withCredentials: true, // Include credentials (cookies)
      });
      const data = await response.data;
      if (data === "Unsuccessful") {
        setResponseMessage({ msg: "Invalid Credentials", unSucess: true });
      } else if (data === "Success") {
        setResponseMessage({ msg: "Successfully Logged In", sucess: true });
        setTimeout(() => {
          onLogin();
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setResponseMessage({ msg: "An error occurred. Please try again.", unSucess: true });
    }
  };
  

  useEffect(() => {
    const Timer = setTimeout(() => {
      setResponseMessage({ msg: "", unSucess: false, sucess: false });
    }, 2000);

    return () => {
      clearTimeout(Timer);
    };
  }, [responseMessage]);

  return (
    <>
      <main>
        <div className="auth-container">
          <section className="auth-first-section">
            <section className="card-design">
              <section className="u-shaped card-01"></section>
              <section className="u-shaped card-02"></section>
              <section className="u-shaped card-03"></section>
              <section className="u-shaped card-04"></section>
            </section>
            <section className="register-form">
              <h1>User Login</h1>
              <form className="register" onSubmit={handleSubmit}>
                <div className="email-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </div>
                <div className="password-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </div>
                <div className="btn-pass">
                  <button type="submit" className="btn">
                    LOGIN
                  </button>
                </div>
                <div className="forget-pass">
                  <a href="forgetPass">Forget Username password?</a>
                  <a href="register" className="margin-bottom">
                    Create Your Account
                    <i className="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </form>

            </section>
          </section>
          {responseMessage.sucess && (
            <>
              <article className="pop-up">
                <AiFillCheckCircle size={100} color="lime" />
                <h2>{responseMessage.msg}.</h2>
              </article>
            </>
          )}
          {responseMessage.unSucess && (
            <>
              <article
                className="pop-up"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "2rem",
                  flexDirection: "column",
                }}
              >
                <AiOutlineCloseCircle size={100} color="red" />
                <h2 style={{ color: "red" }}>{responseMessage.msg}</h2>
              </article>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Login;