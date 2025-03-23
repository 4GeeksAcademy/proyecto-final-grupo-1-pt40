import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import SignUpRestaurant from "../component/SignUpRestaurant.jsx";
import SignUpClient from "../component/SignUpClient.jsx";
import MainNavbar from "../component/MainNavbar.jsx";
import "../../styles/SignUpPage.css"; 

const SignUpPage = () => {
  return (
    <div>
      <MainNavbar />
      <div className="signup-page-container">
        <Tabs
          defaultActiveKey="client"
          id="fill-tab-example"
          className="signup-tabs mb-3"
          fill
        >
          <Tab
            eventKey="client"
            title="Registrarte como Cliente"
            key="client"
            className="signup-tab"
          >
            <SignUpClient />
          </Tab>
          <Tab
            eventKey="restaurant"
            title="Registrar Restaurante"
            key="restaurant"
            className="signup-tab"
          >
            <SignUpRestaurant />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default SignUpPage;