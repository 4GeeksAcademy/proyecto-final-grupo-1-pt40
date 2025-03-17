import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Container, Row, Col, Form, Button, ListGroup, Tabs, Tab, Table } from "react-bootstrap";
import NotificationModal from "../component/NotificationModal.jsx";
import AdminNavbar from "../component/AdminNavbar.jsx";


const AdminReports = () => {

    const { store, actions } = useContext(Context);

    const onLoad = async () => {
        const reports = await actions.adminGetReports()
    }


    const handleDelete = async (id) => {
        const response = await actions.deleteReport(id)
        if (!response) alert('Error eliminando reporte')
    }

    const handleUpdate = async (id) => {
        const response = await actions.updateReport(id)
        if (!response) alert('Error actualizando reporte')
    }
    useEffect(() => {
        onLoad()
    }, [])
    return (

        <Container fluid>
            <AdminNavbar />
            {store.reports.length > 0 ? (<Table striped responsive className="my-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ID Cliente</th>
                        <th>ID Restaurante</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Asunto</th>
                        <th>Mensaje</th>
                        <th>Fecha</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>

                    {store.reports.map((re, index) => (
                        <tr key={re.report_id}>
                            <td>{re.report_id}</td>
                            <td>{re.client_id}</td>
                            <td>{re.restaurant.restaurant_id}</td>
                            <td>{re.restaurant.name}</td>
                            <td>{re.restaurant.email}</td>
                            <td>{re.subject}</td>
                            <td>{re.message}</td>
                            <td>{re.date}</td>
                            <td>{re.read ? 'En revision' : 'Sin revisar'}</td>
                            <td>
                                <div className="justify-content-around d-flex align-middle">
                                    <NotificationModal contact={re.restaurant} />
                                    <Button variant="info" size="sm" onClick={() => handleUpdate(re.report_id)}>Marcar en Revisión</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(re.report_id)}>Eliminar</Button>
                                </div>
                            </td>
                        </tr>
                    ))
                    }

                </tbody>
            </Table>

            ) : (<div>No hay reportes en estos momentos</div>)}
        </Container>
    )

}


export default AdminReports