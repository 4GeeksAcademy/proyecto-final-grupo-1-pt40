import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const FavoriteView = () => {
    const { store, actions } = useContext(Context);


    useEffect(() => {
        if (store.client?.id) {
            actions.fetchFavorites(store.client.id);
        }
    }, [store.client]);

    return (




        <div>
            <h2>Mis Favoritos</h2>
            {store.favorites.length === 0 ? (
                <p>No tienes favoritos aún.</p>
            ) : (
                <ul>
                    {store.favorites.map(fav => {
                        const dish = store.dishes.find(d => d.id === fav.dish_id);
                        const restaurant = store.restaurants.find(r => r.id === fav.restaurant_id);

                        return (
                            <li key={fav.id}>
                                {dish && `Platillo: ${dish.name}`}
                                {restaurant && `Restaurante: ${restaurant.name}`}
                                <button onClick={() => actions.removeFavorite(fav.id)}>Eliminar</button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>


    );
};

export default FavoriteView;
