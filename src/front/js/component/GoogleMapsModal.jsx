import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import GoogleMaps from './GoogleMaps.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

const GoogleMapsModal = ({ addressLink }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="light" className='text-dark gray-button py-3 px-4 align-items-center' onClick={handleShow}>
        <FontAwesomeIcon className='fs-4 mx-1' icon={faLocationDot} /> Google Maps
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className='text-orange fs-4 fw-bold'>UBICACIÓN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GoogleMaps address={addressLink} />
        </Modal.Body>
        <Modal.Footer>
          <Button className='gray-button fs-5' onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GoogleMapsModal;