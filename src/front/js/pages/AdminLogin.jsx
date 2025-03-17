import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Button, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

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
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={() => handleLogin()}>
                Iniciar Sesión
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;