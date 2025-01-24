import React, { useState, useEffect } from "react";

import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import { useNavigate } from "react-router-dom";

import "./login-register.css";

import axios from "axios";

const ForgetPass = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    sucess: false,
    unSucess: false,
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("http://localhost:8000/api/sendResetPasswordLink", {
        email,
      });
      console.log(response.data);
      if (response.data === "UnSucessfull") {
        setResponseMessage({ msg: "Invalid Email", unSucess: true });
      } else if (response.data === "Sucess") {
        setResponseMessage({
          msg: "Sucessfull, Please Check your Email For Verification",
          sucess: true,
        });
        setTimeout(() => {
          window.location.reload(navigate("/login"));
        }, 2000);
      }
    } catch (error) {
      console.log(error);
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
              <h1 id="reset-pass">Reset Password</h1>
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="btn-pass">
                  <button type="submit" className="btn">
                    Reset Password
                  </button>
                </div>
                <div className="forget-pass">
                  <a href="register" className="margin-bottom">
                    Create Your Account
                    <i className="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </form>
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
          </section>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default ForgetPass;
