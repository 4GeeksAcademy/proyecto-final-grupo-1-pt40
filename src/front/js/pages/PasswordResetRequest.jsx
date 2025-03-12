import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'


const PasswordResetRequest = () => {
    const { token } = useParams();

    return (
        <Container>
            <Row>
                <div>Para cambiar o recuperar tu contraseña, ingresa tu email en el siguiente campo</div>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            Si tu email se encuentra en nuestros registros, recibiras un correo con instrucciones para cambiar tu contraseña
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Solicitar Cambio de Contraseña
                    </Button>
                </Form>
            </Row>
        </Container>

    )

}

export default PasswordResetRequest