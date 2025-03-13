import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton.jsx';
import { Context } from "../store/appContext";


function RestaurantCard({data}) {
    const { store, actions } = useContext(Context);

    const navigateTo = useNavigate()
    const handleClick = async (username)=>{
        const response = await actions.getRestaurantMenusPublic(username)
        if (response && response[0].menu_id){
            navigateTo(`restaurant/${username}/menu/${response[0].menu_id}`)
        }else{
            alert('El restaurante no se encuentra activo')
        }

    }

    return (
        <Card style={{ width: '16rem', height: '24rem' }}>
            <Card.Img variant="top" style={{ width: '100%', height: '10rem', objectFit: 'cover' }}
                src={data.image} />
            <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                <Card.Text><strong></strong><Badge bg="secondary" className='p-2 m-0'>{data.cuisine_type}</Badge></Card.Text>
                <Card.Text className='m-0 p-0'><strong>Dirección: </strong> {data.exact_address}</Card.Text>
                <Card.Text className='m-0 p-0'>{`${data.city}, ${data.department}`}</Card.Text>
            </Card.Body>
            <Card.Footer className='align-items-center'>
                <Button variant="primary" onClick={()=>handleClick(data.username)}>Ver Menu</Button>
                <FavoriteButton dish_id={null} restaurant_id={data.restaurant_id}/>
            </Card.Footer>
        </Card>
    );
}

export default RestaurantCard;
