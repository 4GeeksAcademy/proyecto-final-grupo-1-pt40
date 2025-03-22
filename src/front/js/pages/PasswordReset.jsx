import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import MainNavbar from "../component/MainNavbar.jsx"; 
import "../../styles/PasswordReset.css"; 

const PasswordReset = () => {
  const location = useLocation();
  const navigateTo = useNavigate();
  const [allow, setAllow] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const { store, actions } = useContext(Context);

  const checkToken = async (token) => {
    const response = await actions.checkResetToken(token);
    if (response) {
      setAllow(true);
      setEmail(response.email);
      setToken(token);
    } else {
      setAllow(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }
    setError("");
    const response = await actions.updatePassword(token, email, password);
    if (response) {
      navigateTo("/login");
    } else {
      setError("Algo salió mal, vuelve a intentarlo más tarde");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      checkToken(tokenParam);
    }
  }, [location.search]);

  if (allow === "") {
    return (
      <Container className="reset-container mt-5">
        <Row className="justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="warning" />
        </Row>
      </Container>
    );
  }

  return (
    <div>
      <MainNavbar />
      <Container className="reset-container mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="reset-card">
              <Card.Body>
                <h2 className="reset-title">Cambiar Contraseña</h2>
                <p className="reset-subtitle">
                  Ingresa tu nueva contraseña para completar el proceso.
                </p>

                {allow ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="Password">
                      <Form.Label className="form-label">Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Ingresa una nueva contraseña (mínimo 4 caracteres)"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        isInvalid={!!error}
                      />
                      <Form.Text className="form-text">
                        Asegúrate de que tu nueva contraseña sea segura.
                      </Form.Text>
                      {error && (
                        <Form.Control.Feedback type="invalid" className="error-message">
                          {error}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Button type="submit" className="reset-button">
                      Cambiar Contraseña
                    </Button>
                  </Form>
                ) : (
                  <Alert variant="danger" className="reset-alert">
                    El enlace ha expirado o es inválido. Solicita un enlace nuevo.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordReset;