import React from "react";
import Login from "../component/Login.jsx";
import MainNavbar from "../component/MainNavbar.jsx";
import "../../styles/LoginPage.css"; 

const LoginPage = () => {
  return (
    <div>
      <MainNavbar />
      <div className="login-page-container">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;