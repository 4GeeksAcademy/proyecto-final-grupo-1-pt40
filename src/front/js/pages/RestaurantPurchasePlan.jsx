import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import { Container, Card, Button, Row, Col, Nav, Badge, Spinner } from "react-bootstrap";
import PayPal from '../component/PayPal.jsx';
import RestaurantNavbar from '../component/RestaurantNavbar.jsx';




const RestaurantPurchasePlan = () => {
    const { store, actions } = useContext(Context);
    const [plan, setPlan] = useState('')

    const onLoad = async () => {
        const response = await actions.getRestaurantDetails()
        if (response) setPlan(store.restaurantDetails.plan)
    }


    useEffect(() => {
        onLoad()
    }, [])



    return (
        <>
            <RestaurantNavbar />
            <Container fluid className='mt-4'>
                {store.plan === '' ? (<Spinner variant='danger'></Spinner>) :
                    store.plan ? (<Row className='w-100'>
                        <Col>
                            <Card className='p-3'>
                                <Card.Body>
                                    <h2>Plan: <span className='fw-bold text-orange'>AlPunto+</span></h2>
                                    <Card.Text>Posees el plan AlPunto+ el cual incluye menús y platillos ilimitados. Gracias por tu compra!</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>) :


                        (<Row className='w-100'>
                            <Col xs md lg='6'>
                                <Card className='p-3'>
                                    <Card.Body>
                                        <h2>Plan: Demo (Actual)</h2>
                                        <Card.Text>Incluye un menú con 10 platillos. Para crear más de un menú o añadir más de 10 platillos puedes adquirir el plan AlPunto+</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs md lg='6'>
                                <Card className='p-3'>
                                    <Card.Body>
                                        <h2>Plan: <span className='fw-bold text-orange'>ALPUNTO+</span></h2>
                                        <Card.Text>Crea menús y añade platillos sin límites!</Card.Text>
                                        <Card.Text><strong>Costo:</strong> 10 Dólares Americanos</Card.Text>
                                        <Card.Text><strong>Frecuencia:</strong> Pago Único</Card.Text>
                                        <Card.Text><strong>Métodos de Pago:</strong></Card.Text>
                                        <PayPal />

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        )
                }

            </Container>
        </>

    )
};

export default RestaurantPurchasePlan;