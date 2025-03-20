import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import { Form, ListGroup, Card } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Widget } from "@uploadcare/react-widget";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

function EditModal({ dish }) {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(false);
    const [newDish, setNewDish] = useState(dish);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleEdit = async () => {
        await actions.menuBuilderEditDish(dish.dish_id, newDish, dish.category)
        setShow(false)
    }

    const handleFileChange = (file) => {
        setNewDish({ ...newDish, image: file.cdnUrl })
    }
    return (
        <>
            <Button variant="warning" className="d-inline-block p-2" size="md" onClick={handleShow}>
                <FontAwesomeIcon className='text-dark fs-5' icon={faPenToSquare} />
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar Platillo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label className="fw-bold">Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre del Platillo"
                            value={newDish.name}
                            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                        />
                        <Form.Group>
                         <Form.Label className="fw-bold">Imagen: </Form.Label>
                         <span className="ms-1">
                        <Widget publicKey='47bd03853371888b5541' value={newDish.image} onChange={handleFileChange} />
                         </span>
                        </Form.Group>

                        <Form.Label className="fw-bold">Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Descripción del Platillo"
                            value={newDish.description}
                            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                        />
                        <Form.Label className="fw-bold">Precio</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Precio del Platillo"
                            value={newDish.price}
                            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button className="orange-button" onClick={handleEdit}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditModal;