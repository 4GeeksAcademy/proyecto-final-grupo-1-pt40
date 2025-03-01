import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const FavoriteView = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.client?.id) {
            actions.fetchFavorites();
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
                        return (
                            <li key={fav.id}>
                                {dish ? dish.name : "Platillo desconocido"}
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
