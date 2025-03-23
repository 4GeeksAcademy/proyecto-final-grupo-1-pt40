import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import {Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const FavoriteButton = ({ dish_id, restaurant_id, status, id }) => {
    const { store, actions } = useContext(Context);
    const [like, setLike] = useState(status)
    const initialRender = useRef(true);
    
    const dishId = dish_id ? parseInt(dish_id) : null;
    const restaurantId = restaurant_id ? parseInt(restaurant_id) : null;
    
    
    const handleLike = async () =>{
        if (!like){
            const response = await actions.addFavorite(dish_id,restaurant_id)
            if (response){
                setLike(true)
            }
        }else{
            const response = await actions.removeFavorite(id)
            if (response){
                setLike(false)
        }
    }}

    useEffect(() => {
        setLike(status);
    }, [status]);


    return (
       <Button onClick = {handleLike} style={{backgroundColor:'gray', border:'none'}}>
            <FontAwesomeIcon  className={`fs-5 ${like ? 'text-orange': 'text-light'}`} icon={faHeart} />
       </Button>
    );
};

export default FavoriteButton;