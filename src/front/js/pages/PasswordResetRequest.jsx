import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'


const PasswordResetRequest = () => {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [role, setRole] = useState('client')
    const { store, actions } = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            alert('Debes escribir un correo electrónico')
            return null
        }
        const response = await actions.passwordResetRequest(email, role)
        if (response || !response) {
            setSent(true)
            setEmail('')

        }
    }

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    }

    return (
        <Container className="m-5">
            <Row>
                {sent && <Alert variant='success'>
                    Hemos enviado un correo a tu email, revisa tu bandeja de entrada con las instrucciones
                </Alert>}
                <div>Para cambiar o recuperar tu contraseña, ingresa tu email y tipo de cuenta en el siguiente formulario</div>
                <Form>
                    <Form.Group>
                        <Form.Check
                            inline
                            label="Cliente"
                            name="role" // Same name for both radio buttons
                            type="radio"
                            id={`inline-radio-1`}
                            value="client"
                            defaultChecked
                            onChange={handleRoleChange}
                        />
                        <Form.Check
                            inline
                            label="Restaurante"
                            name="role" // Same name for both radio buttons
                            type="radio"
                            id={`inline-radio-2`}
                            value="restaurant"
                            onChange={handleRoleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control type="email" value={email} placeholder="Ingresa tu email" onChange={(e) => setEmail(e.target.value)} />
                        <Form.Text className="text-muted">
                            Si tu email se encuentra en nuestros registros, recibiras un correo con instrucciones para cambiar tu contraseña
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Solicitar Cambio de Contraseña
                    </Button>
                </Form>
            </Row>
        </Container>

    )

}

export default PasswordResetRequest