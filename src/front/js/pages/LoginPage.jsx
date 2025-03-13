import React from "react";
import Login from "../component/Login.jsx";
import MainNavbar from "../component/MainNavbar.jsx";

const LoginPage = () => {
  return (
    <div>
      <MainNavbar />
      <div className="login-container">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
