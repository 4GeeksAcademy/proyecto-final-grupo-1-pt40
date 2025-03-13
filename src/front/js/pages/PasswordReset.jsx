import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'


const PasswordReset = () => {
    const location = useLocation();
    const navigateTo = useNavigate()
    const [allow, setAllow] = useState('')
    const [token, setToken] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { store, actions } = useContext(Context);

    const checkToken = async (token) => {
        const response = await actions.checkResetToken(token)
        if (response) {
            setAllow(true)
            setEmail(response.email)
            setToken(token)
        }

        else if (!response) {
            setAllow(false)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 4) {
            alert('La contraseña debe tener al menos 4 caracteres')
            return null
        }
        console.log(password)
        const response = await actions.updatePassword(token, email, password)
        if (response) {
            navigateTo('/login')
        } else {
            alert('Algo salió mal, vuelve a intentarlo más tarde')
        }
    }
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
            checkToken(tokenParam)

        }
    }, [location.search]);

    if (allow === '') {
        return (

            <Container fluid>
                <Row className="justify-content-center align-items-center h-100">
                    <Spinner animation="border" variant="warning" />
                </Row>
            </Container>
        )
    }

    return (

        <Container>

            {allow ? (<Form>
                <Form.Group className="mb-3" controlId="Password">
                    <Form.Label>Nueva Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Ingresa una nueva contraseña (mínimo 4 caracteres)"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Cambiar Contraseña
                </Button>
            </Form>) : (<Alert variant='danger'>El enlace ha expirado o es inválido, solicita un enlace nuevo</Alert>)}




        </Container>

    )

}

export default PasswordReset