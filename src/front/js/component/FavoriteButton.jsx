// import React, { useContext } from "react";
// import { Context } from "../store/appContext";

// const FavoriteButton = ({ dish_id , restaurant_id  }) => {
//     const { store, actions } = useContext(Context);


    
   
//     const isFavorite = store.favorites.some(fav =>
//         (dish_id && fav.dish_id === dish_id) ||
//         (restaurant_id && fav.restaurant_id === restaurant_id)
//     );

    
//     const handleFavorite = () => {
        
       
//         if (!store.client?.client_id) {
//             console.log("🛑 store.client.id está vacío o undefined");
//             alert("Debes iniciar sesión para guardar favoritos.");
//             return;
            
            
//         }
//         console.log("✅ El usuario tiene id:", store.client.client_id);
        
//         if (isFavorite) {
           
//             const favorite = store.favorites.find(fav =>
//                 (dish_id && fav.dish_id === dish_id) ||
//                 (restaurant_id && fav.restaurant_id === restaurant_id)
//             );
    
//             if (favorite) {
//                 actions.removeFavorite(favorite.id);
//             }
//         } else {
            
//             if (dish_id) {
//                 actions.addFavorite(dish_id, null);
//             } else if (restaurant_id) {
//                 actions.addFavorite(null, restaurant_id);
//             } else {
//                 console.error("No se proporcionó ni dish_id ni restaurant_id");
//             }
//         }
            
        
//     };

//     return (
//         <button onClick={handleFavorite} className="btn btn-outline-danger">
//             {isFavorite ? "❤️" : "🤍"}
//         </button>
//     );
// };

// export default FavoriteButton;

import React, { useContext } from "react";
import { Context } from "../store/appContext";

const FavoriteButton = ({ dish_id, restaurant_id }) => {
    const { store, actions } = useContext(Context);

    // Asegúrate de que store.favorites sea un array, si no, usa []
    const favorites = Array.isArray(store.favorites) ? store.favorites : [];
    const isFavorite = favorites.some(fav =>
        (dish_id && fav.dish_id === dish_id) ||
        (restaurant_id && fav.restaurant_id === restaurant_id)
    );

    const handleFavorite = () => {
        if (!store.client?.client_id) {
            console.log("🛑 store.client.id está vacío o undefined");
            alert("Debes iniciar sesión para guardar favoritos.");
            return;
        }
        console.log("✅ El usuario tiene id:", store.client.client_id);

        if (isFavorite) {
            const favorite = favorites.find(fav =>
                (dish_id && fav.dish_id === dish_id) ||
                (restaurant_id && fav.restaurant_id === restaurant_id)
            );

            if (favorite) {
                actions.removeFavorite(favorite.id);
            }
        } else {
            if (dish_id) {
                actions.addFavorite(dish_id, null);
            } else if (restaurant_id) {
                actions.addFavorite(null, restaurant_id);
            } else {
                console.error("No se proporcionó ni dish_id ni restaurant_id");
            }
        }
    };

    return (
        <button onClick={handleFavorite} className="btn btn-outline-danger">
            {isFavorite ? "❤️" : "🤍"}
        </button>
    );
};

export default FavoriteButton;