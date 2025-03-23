import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../styles/index.css';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store, actions } = useContext(Context);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      const success = await actions.loginAdmin(email, password);
      if (success) {
        navigate("/admin-dashboard")
      } else {
        alert("Error en el login. Verifica tus credenciales.");
      }
    } else {
      alert("Por favor, ingrese su email y contraseña.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-background">
      <Card className="login-card">
        <h3 className="text-center mb-3">Iniciar Sesión</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button className="login-button" onClick={() => handleLogin()}>
                Iniciar Sesión
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;