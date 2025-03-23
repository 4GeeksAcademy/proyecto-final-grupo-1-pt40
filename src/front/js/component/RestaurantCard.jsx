import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton.jsx';
import { Context } from "../store/appContext";


function RestaurantCard({ data }) {
    const { store, actions } = useContext(Context);

    const navigateTo = useNavigate()
    const handleClick = async (username) => {
        const response = await actions.getRestaurantMenusPublic(username)
        if (response && Array.isArray(response)) {
            navigateTo(`/restaurant/${username}/menu/${response[0].menu_id}`)
        } else {
            alert('El restaurante no se encuentra activo')
        }

    }

    return (

        <Card className="restaurant-card" style={{ width: '16rem', height: '23rem' }}>
            <Card.Img variant="top" style={{ width: '100%', height: '10rem', objectFit: 'cover' }}
                src={data.image} />
            <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                <Card.Text>
                    <Badge className='cuisine-badge p-2 m-0'>{data.cuisine_type}</Badge>
                </Card.Text>
                <Card.Text className='m-0 p-0'>
                    <strong>Dirección: </strong> {data.exact_address}
                </Card.Text>
                <Card.Text className='m-0 p-0'>{`${data.city}, ${data.department}`}</Card.Text>
            </Card.Body>
            <Card.Footer className='restaurant-footer p-1'>
                <Button className="menu-button" onClick={() => handleClick(data.username)}>
                    Ver Menu
                </Button>
                <div className="me-1">
                    <FavoriteButton dish_id={null} restaurant_id={data.restaurant_id} />
                </div>
            </Card.Footer>
        </Card>
    )

}

export default RestaurantCard;
