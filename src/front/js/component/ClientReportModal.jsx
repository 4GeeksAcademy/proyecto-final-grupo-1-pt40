import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ClientReportModal({ restaurant_id }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSendReport = async () => {
        if (!store.client?.client_id) {
            alert("Debes iniciar sesión para reportar un restaurante.");
            navigate("/login");
            return;
    
        }

        if (!subject.trim() || !message.trim()) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const response = await actions.clientMakeReport(restaurant_id, subject, message);
        if (response) {
            alert("Reporte enviado correctamente.");
            setShow(false);
        } else {
            alert("Hubo un error al enviar el reporte.");
        }
    };

    return (
        <>
            <Button className="bg-secondary mt-3" onClick={handleShow}>Reportar Restaurante</Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Reportar Restaurante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Asunto</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el motivo del reporte"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Mensaje</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe el problema"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={handleSendReport}>Enviar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ClientReportModal;
