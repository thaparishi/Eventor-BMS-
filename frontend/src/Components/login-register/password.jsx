import React, { useState } from "react";

import { useParams } from "react-router-dom";

import "./login-register.css"

const url = "http://localhost:8000/api/changePassword"

const ForgetPass = () => {
 // const [changeHeader,] = useState(true);
 const [user, setUser] = useState({ email: "", password: "", re_password: "" })

 const { id } = useParams();

 const handleOnChange = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  setUser({ ...user, [name]: value })
 }

 const handleSubmit = (e) => {
  e.preventDefault();
  //Passing the email received from url.
  user.email = id;
  if (user.password === user.re_password) {
   // Fetch code here...
   fetch(url, {
    method: "POST",
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
   }).then((response) => {
    return response.json()
   }).then((data) => {
    if (data.success) {
     window.location.href = "/"
    }
   }).catch((error) => {
    console.log(error)
   })
  } else {
   alert("Password did not match.");
  }
 }

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
       <h1 id="reset-pass">Type Password</h1>
       <form className="register" onSubmit={handleSubmit}>
        <div className="password-field">
         <span className="login-icon"><i className="fa-solid fa-lock"></i></span>
         <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleOnChange}
         />
        </div>
        <div className="password-field">
         <span className="login-icon"><i className="fa-solid fa-lock"></i></span>
         <input
          type="password"
          id="re_password"
          name="re_password"
          placeholder="Retype Password"
          value={user.re_password}
          onChange={handleOnChange}
         />
        </div>
        <div className="btn-pass">
         <button type="submit" className="btn">Reset Password</button>
        </div>
        <div className="forget-pass">
         <a href="register" className="margin-bottom">
          Create Your Account
          <i className="fa-solid fa-arrow-right"></i>
         </a>
        </div>
       </form>
      </section>
     </section>
    </div>
   </main>
   {/* <Footer /> */}
  </>
 )
}

export default ForgetPass