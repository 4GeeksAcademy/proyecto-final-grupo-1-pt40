import React, { useContext } from "react";
import { Context } from "../store/appContext";

const FavoriteButton = ({ dish_id = null, restaurant_id = null }) => {
    const { store, actions } = useContext(Context);

    
    const isFavorite = store.favorites.some(fav =>
        (dish_id && fav.dish_id === dish_id) ||
        (restaurant_id && fav.restaurant_id === restaurant_id)
    );

    
    const handleFavorite = () => {
        if (!store.client?.client_id) return alert("Debes iniciar sesión para guardar favoritos.");

        if (isFavorite) {
            
            const favorite = store.favorites.find(fav =>
                (dish_id && fav.dish_id === dish_id) ||
                (restaurant_id && fav.restaurant_id === restaurant_id)
            );
            actions.removeFavorite(favorite.id);
        } else {
           
            actions.addFavorite(store.client.client_id, dish_id, restaurant_id);
        }
    };

    return (
        <button onClick={handleFavorite} className="btn btn-outline-danger">
            {isFavorite ? "❤️" : "🤍"}
        </button>
    );
};

export default FavoriteButton;