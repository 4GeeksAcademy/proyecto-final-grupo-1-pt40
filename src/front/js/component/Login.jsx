import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "24rem" }} className="p-4 shadow">
        <h3 className="text-center mb-3">Iniciar Sesión</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Text className="text-muted">
              <Link className="nav-link" to="/password-reset-request">¿Olvidaste tu contraseña?</Link>
            </Form.Text>
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="primary" onClick={() => handleLogin("client")}>
              Cliente
            </Button>
            <Button variant="success" onClick={() => handleLogin("restaurant")}>
              Restaurante
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;