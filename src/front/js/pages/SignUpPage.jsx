import React from "react";
import { Tabs, Tab } from 'react-bootstrap'
import SignUpRestaurant from "../component/SignUpRestaurant.jsx";
import SignUpClient from "../component/SignUpClient.jsx";

const SignUpPage = () => {
  return (
    <Tabs defaultActiveKey="client" id="fill-tab-example" className="mb-3" fill>
      <Tab eventKey='client' title='Registrarte como Cliente' key='client'>
        <SignUpClient />
      </Tab>
      <Tab eventKey='restaurant' title='Registrar Restaurante' key='restaurant'>
        <SignUpRestaurant />
      </Tab>
    </Tabs>
  );
};

export default SignUpPage;
