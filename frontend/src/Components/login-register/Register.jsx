import React, { useState} from "react";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login-register.css";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState({
    msg: "",
    success: false,
    unSuccess: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/register", user);

      if (response.data === "UnSuccessful") {
        setResponseMessage({ msg: "Cannot Register", unSuccess: true });
      } else if (response.data === "Success") {
        setResponseMessage({
          msg: "Registration Successful! Please check your email to confirm.",
          success: true,
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setResponseMessage({ msg: "Error occurred", unSuccess: true });
    }
  };

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
              <h1 id="register-text">Register Account</h1>
              <form className="register" onSubmit={handleSubmit}>
                <div className="name-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Username"
                    value={user.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="email-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    placeholder="Email"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="number-field">
                  <span className="login-icon">
                    <i className="fa-solid fa-phone"></i>
                  </span>
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    placeholder="Phone Number"
                    value={user.number}
                    onChange={handleChange}
                    pattern="[0-9]{10,}"
                    title="Phone number must contain at least 10 digits."
                    required
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
                    value={user.password}
                    onChange={handleChange}
                    pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$"
                    title="Password must contain at least one uppercase letter, one number, and one special character."
                    required
                  />
                </div>

                <div className="btn-pass">
                  <button type="submit" className="btn">
                    Register Account
                  </button>
                </div>
                <div className="forget-pass">
                  <a href="/login">Already have an account? Sign in</a>
                </div>
              </form>
            </section>

            {responseMessage.success && (
              <article className="pop-up">
                <AiFillCheckCircle size={100} color="lime" />
                <h2>{responseMessage.msg}</h2>
                <div className="success-buttons">
                  <button className="btn" onClick={() => navigate("/")}>🏠 Home</button>
                  <button className="btn" onClick={() => navigate("/login")}>🔐 Login</button>
                </div>
              </article>
            )}

            {responseMessage.unSuccess && (
              <article className="pop-up" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", flexDirection: "column" }}>
                <AiOutlineCloseCircle size={100} color="red" />
                <h2 style={{ color: "red" }}>{responseMessage.msg}</h2>
              </article>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Register;
