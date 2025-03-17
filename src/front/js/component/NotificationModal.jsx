import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import { Form, Dropdown, DropdownButton, } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";

function NotificationModal({ contact }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [subject, setSubject] = useState('Selecciona un asunto');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const subjects = ['Promoción', 'Ofertas', 'Aviso Importante', 'Solicitud de actualización de datos de registro', 'Eliminar contenido inapropiado', 'Verificación de email/teléfono', 'Otros']

    const handleSelect = (eventKey) => {
        setSubject(eventKey)
    }

    const handleSend = async () => {
        if (subjects.includes(subject)) {
            const response = await actions.adminSendNotification(contact.restaurant_id, subject, message)
            if (response) {
                setShow(false)
            } else {
                alert('Algo salió mal, no se envió la notificación')
            }
        } else {
            alert('Debes seleccionar un asunto')
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Enviar Notificación
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Notificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>ID de Restaurante</Form.Label>
                        <Form.Control
                            type="text"
                            value={contact.restaurant_id}
                            disabled
                        />
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={contact.username}
                            disabled
                        />
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={contact.email}
                            disabled
                        />
                        <Form.Label>Asunto</Form.Label>
                        <DropdownButton className="mt-3" id="dropdown-basic-button" title={subject} onSelect={handleSelect}>
                            {subjects.map((sub, index) => (
                                <Dropdown.Item eventKey={sub} key={index}>{sub}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Mensaje - Opcional</Form.Label>
                            <Form.Control as="textarea" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Escribe un mensaje para acompañar la notificación..." />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSend}>Enviar</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default NotificationModal; 