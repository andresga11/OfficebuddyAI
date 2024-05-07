import React, { useState } from "react";
import axios from "axios";


export const Login = ({ onFormSwitch, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`http://localhost:3005/api/user/validatePassword`, { email, pass })
      .then((res) => {
        if (res.data.validation) {
          alert("Your password is correct, Thank you!");
          onLoginSuccess();
        } else {
          alert("Your password is not correct, Please try again");
        }
      });
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlfor="email"> Email </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="youremail@gmail.com"
          id="email"
          name="email"
        />
        <label htmlfor="password"> Password </label>
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          type="password"
          placeholder="*********"
          id="password"
          name="password"
        />
        <button type="submit">Log In</button>
      </form>
      <button className="link-btn" onClick={() => onFormSwitch("register")}>
        Don't have an account? Register here.
      </button>
    </div>
  );
};
