import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/Login.css"; 

const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const LoginForm = ({ role }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
      if (email && password) {
        const success = await actions.loginUser(role, email, password);
        if (success) {
          if (role === "client") {
            navigate("/client-dashboard");
          } else if (role === "restaurant") {
            navigate("/restaurant-dashboard");
          }
        } else {
          alert("Error en el login. Verifica tus credenciales.");
        }
      } else {
        alert("Por favor, ingrese su email y contraseña.");
      }
    };

    return (
      <Form className="login-form">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Text className="forgot-password">
            <Link to="/password-reset-request">¿Olvidaste tu contraseña?</Link>
          </Form.Text>
        </Form.Group>
        <Button 
          className="login-button w-100" 
          onClick={handleLogin}
        >
          INICIAR SESIÓN
        </Button>
      </Form>
    );
  };

  return (
    <div className="login-container">
      <h2 className="login-title">INICIAR SESIÓN</h2>
      <Tabs
        defaultActiveKey="client"
        id="login-tabs"
        className="login-tabs mb-3"
        fill
      >
        <Tab
          eventKey="client"
          title="Cliente"
          key="client"
          className="login-tab"
        >
          <LoginForm role="client" />
        </Tab>
        <Tab
          eventKey="restaurant"
          title="Restaurante"
          key="restaurant"
          className="login-tab"
        >
          <LoginForm role="restaurant" />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Login;