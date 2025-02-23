import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const FavoriteView = ({ userId }) => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.fetchFavorites(userId);
    }, [userId]);

    return (
        <div>
            <h2>Mis Favoritos</h2>
            {store.favorites.length === 0 ? (
                <p>No tienes favoritos aún.</p>
            ) : (
                <ul>
                    {store.favorites.map(fav => (
                        <li key={fav.id}>
                            {fav.name} 
                            <button onClick={() => actions.removeFavorite(fav.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoriteView;