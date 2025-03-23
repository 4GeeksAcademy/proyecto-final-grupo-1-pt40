import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton.jsx';
import { Context } from "../store/appContext";


function RestaurantCard({ data }) {
    const { store, actions } = useContext(Context);
    const [like, setLike] = useState(false)
    const [idFav, setIdFav] = useState(null)
    const navigateTo = useNavigate()
    const token = sessionStorage.getItem('token')
    const handleClick = async (username) => {
        const response = await actions.getRestaurantMenusPublic(username)
        if (response && Array.isArray(response)) {
            navigateTo(`/restaurant/${username}/menu/${response[0].menu_id}`)
        } else {
            alert('El restaurante no se encuentra activo')
        }

    }

    const checkRestaurant = () => {
        if (Array.isArray(store.favorites) && store.favorites.length > 0) {
            const restaurants = store.favorites.filter(fav => fav.restaurant);
            if (restaurants.length > 0) {
                const status = restaurants.some(res => res.restaurant.restaurant_id === data.restaurant_id)
                if (status) {
                    const favInfo = restaurants.filter(res => res.restaurant.restaurant_id === data.restaurant_id)
                    console.log(favInfo)
                    setLike(true)
                    setIdFav(favInfo[0].id)
                }
            }
        }
    }

    useEffect(() => {
        checkRestaurant()
    }, [])

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
                    {token && <FavoriteButton dish_id={null} restaurant_id={data.restaurant_id} status={like} id={idFav} />}
                </div>
            </Card.Footer>
        </Card>
    )

}

export default RestaurantCard;
