// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Context } from "../store/appContext";
// import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
// import MainNavbar from "../component/MainNavbar.jsx";


// const PasswordResetRequest = () => {
//     const [email, setEmail] = useState('')
//     const [sent, setSent] = useState(false)
//     const [role, setRole] = useState('client')
//     const { store, actions } = useContext(Context);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email || !email.includes('@')) {
//             alert('Debes escribir un correo electrónico')
//             return null
//         }
//         const response = await actions.passwordResetRequest(email, role)
//         if (response || !response) {
//             setSent(true)
//             setEmail('')

//         }
//     }

//     const handleRoleChange = (event) => {
//         setRole(event.target.value);
//     }

//     return (
//         <div>
//             <MainNavbar />
//             <Container className="m-5">
//                 <Row>
//                     {sent && <Alert variant='success'>
//                         Hemos enviado un correo a tu email, revisa tu bandeja de entrada con las instrucciones
//                     </Alert>}
//                     <div>Para cambiar o recuperar tu contraseña, ingresa tu email y tipo de cuenta en el siguiente formulario</div>
//                     <Form>
//                         <Form.Group>
//                             <Form.Check
//                                 inline
//                                 label="Cliente"
//                                 name="role" // Same name for both radio buttons
//                                 type="radio"
//                                 id={`inline-radio-1`}
//                                 value="client"
//                                 defaultChecked
//                                 onChange={handleRoleChange}
//                             />
//                             <Form.Check
//                                 inline
//                                 label="Restaurante"
//                                 name="role" // Same name for both radio buttons
//                                 type="radio"
//                                 id={`inline-radio-2`}
//                                 value="restaurant"
//                                 onChange={handleRoleChange}
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3" controlId="formBasicEmail">
//                             <Form.Label>Correo Electrónico</Form.Label>
//                             <Form.Control type="email" value={email} placeholder="Ingresa tu email" onChange={(e) => setEmail(e.target.value)} />
//                             <Form.Text className="text-muted">
//                                 Si tu email se encuentra en nuestros registros, recibiras un correo con instrucciones para cambiar tu contraseña
//                             </Form.Text>
//                         </Form.Group>
//                         <Button variant="primary" type="submit" onClick={handleSubmit}>
//                             Solicitar Cambio de Contraseña
//                         </Button>
//                     </Form>
//                 </Row>
//             </Container>
//         </div>
//     )

// }

// export default PasswordResetRequest

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import MainNavbar from "../component/MainNavbar.jsx";
import "../../styles/PasswordResetRequest.css";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [role, setRole] = useState("client");
  const [error, setError] = useState(""); 
  const { store, actions } = useContext(Context);

  const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Debes ingresar un correo electrónico.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    setError(""); 
    const response = await actions.passwordResetRequest(email, role);
    if (response || !response) {
      setSent(true);
      setEmail("");
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div>
      <MainNavbar />
      <Container className="reset-container mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="reset-card">
              <Card.Body>
                <h2 className="reset-title">Recuperar Contraseña</h2>
                <p className="reset-subtitle">
                  Ingresa tu email y tipo de cuenta para recibir un enlace de recuperación.
                </p>

                {sent && (
                  <Alert variant="success" className="reset-alert">
                    Hemos enviado un correo a tu email. Revisa tu bandeja de entrada para seguir las instrucciones.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Tipo de Cuenta</Form.Label>
                    <div className="role-selection">
                      <Form.Check
                        inline
                        label="Cliente"
                        name="role"
                        type="radio"
                        id="inline-radio-1"
                        value="client"
                        checked={role === "client"}
                        onChange={handleRoleChange}
                        className="form-check"
                      />
                      <Form.Check
                        inline
                        label="Restaurante"
                        name="role"
                        type="radio"
                        id="inline-radio-2"
                        value="restaurant"
                        checked={role === "restaurant"}
                        onChange={handleRoleChange}
                        className="form-check"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="form-label">Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      placeholder="Ingresa tu email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      isInvalid={!!error}
                    />
                    <Form.Text className="form-text">
                      Si tu email está registrado, recibirás un correo con instrucciones para cambiar tu contraseña.
                    </Form.Text>
                    {error && (
                      <Form.Control.Feedback type="invalid" className="error-message">
                        {error}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Button type="submit" className="reset-button">
                    Solicitar Cambio de Contraseña
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordResetRequest;