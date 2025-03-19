import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../styles/Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store, actions } = useContext(Context);

  const navigate = useNavigate();

  const handleLogin = async (role) => {
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
    <div className="login-container">
      <h2 className="login-title">INICIAR SESIÓN</h2>
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
        <div className="d-flex justify-content-between">
          <Button className="login-button" onClick={() => handleLogin("client")}>
            CLIENTE
          </Button>
          <Button
            className="login-button"
            onClick={() => handleLogin("restaurant")}
          >
            RESTAURANTE
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;