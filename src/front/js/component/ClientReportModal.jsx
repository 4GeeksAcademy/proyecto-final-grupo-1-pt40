import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ClientReportModal({ restaurant_id }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLogged, setIsLogged] = useState(false)
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const checkLogged = async () => {
        const clientStatus = await actions.checkClient()
        if (clientStatus) {
            setIsLogged(true)
        } else {
            setIsLogged(false)
        }
    }
    const handleSendReport = async () => {
        if (!isLogged) {
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
            // alert("Reporte enviado correctamente.");
            setShow(false);
        } else {
            alert("Hubo un error al enviar el reporte.");
        }
    };

    useEffect(()=>{
        checkLogged()
    },[])

    return (
        <>
            <Button  variant='danger' className="mt-3 fw-bold" onClick={handleShow}>Reportar Restaurante</Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-orange fw-bold">REPORTAR RESTAURANTE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label className="fw-bold">Asunto</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el motivo del reporte"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="form-input"
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label className="fw-bold">Mensaje</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe el problema"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-input"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="close-modal-button" onClick={handleClose}>Cerrar</Button>
                    <Button variant="danger" className="fw-bold" onClick={handleSendReport}>Enviar</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ClientReportModal;
