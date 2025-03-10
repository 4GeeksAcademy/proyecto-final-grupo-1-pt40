import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import { Container, Card, Button, Row, Col, Nav, Badge } from "react-bootstrap";
import PayPal from '../component/PayPal.jsx';




const RestaurantPurchasePlan = () => {
    const { store, actions } = useContext(Context);
    const [plan, setPlan] = useState('')

    const onLoad = async () => {
        const response = await actions.getRestaurantDetails()
        if (response) setPlan(response.plan)
    }


    useEffect(() => {
        onLoad()
    }, [])

    if (plan === '') {
        return (
            <div>Cargando...</div>
        )
    }

    if (plan === true) {
        return (
            <div>Ya compraste el plan AlPunto+, disfruta de hasta 3 menus, con hasta 50 platillos cada uno. Gracias por su compra!</div>
        )
    }

    return (
        <Container>
            <Row className='w-100'>
                <PayPal />
            </Row>
        </Container>

    )
};

export default RestaurantPurchasePlan;