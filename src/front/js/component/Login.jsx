import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (email && password) {
      if (role === "cliente") {
        navigate("/dashboard-cliente");
      } else if (role === "restaurante") {
        navigate("/dashboard-restaurante");
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
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="primary" onClick={() => handleLogin("cliente")}>
              Cliente
            </Button>
            <Button variant="success" onClick={() => handleLogin("restaurante")}>
              Restaurante
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;