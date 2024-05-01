import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Login } from "./login";
import { Register } from "./register";
import { Chatbot } from "./chatbot";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  //function to simulate a successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        currentForm === "login" ? (
          <Login
            onFormSwitch={toggleForm}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Register onFormSwitch={toggleForm} />
        )
      ) : (
        <Chatbot handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
