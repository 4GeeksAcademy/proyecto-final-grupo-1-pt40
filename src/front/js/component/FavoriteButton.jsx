import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

const FavoriteButton = ({ dish_id, restaurant_id }) => {
    const { store, actions } = useContext(Context);
    const [isFavorite, setIsFavorite] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    
    
    const dishId = dish_id ? parseInt(dish_id) : null;
    const restaurantId = restaurant_id ? parseInt(restaurant_id) : null;
    
    
    useEffect(() => {
        const initializeButton = async () => {
            
            const token = sessionStorage.getItem('token');
            if (!token) {
                setIsInitialized(true);
                return;
            }
            
            
            if (!Array.isArray(store.favorites) || store.favorites.length === 0) {
                
                const cachedFavorites = sessionStorage.getItem('userFavorites');
                if (cachedFavorites) {
                    try {
                        const parsedFavorites = JSON.parse(cachedFavorites);
                        
                        checkIfFavorite(parsedFavorites);
                    } catch (e) {
                        console.error("Error al parsear favoritos guardados:", e);
                    }
                }
                
                
                await actions.fetchFavorites();
            } else {
                
                checkIfFavorite(store.favorites);
            }
            
            setIsInitialized(true);
        };
        
        initializeButton();
    }, []);
    
    
    const checkIfFavorite = (favoritesArray) => {
        if (!Array.isArray(favoritesArray)) return;
        
        const favoriteExists = favoritesArray.some(fav => {
            
            const favDishId = fav.dish_id !== undefined ? parseInt(fav.dish_id) : null;
            const favRestaurantId = fav.restaurant_id !== undefined ? parseInt(fav.restaurant_id) : null;
            
            return (dishId && favDishId === dishId) || 
                   (restaurantId && favRestaurantId === restaurantId);
        });
        
        setIsFavorite(favoriteExists);
    };
    
   
    useEffect(() => {
        if (Array.isArray(store.favorites)) {
            checkIfFavorite(store.favorites);
        }
    }, [store.favorites, dishId, restaurantId]);
    
    
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'userFavorites' && e.newValue) {
                try {
                    const parsedFavorites = JSON.parse(e.newValue);
                    checkIfFavorite(parsedFavorites);
                } catch (error) {
                    console.error("Error al procesar favoritos del storage:", error);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
       
        const currentFavorites = sessionStorage.getItem('userFavorites');
        if (currentFavorites) {
            try {
                const parsedFavorites = JSON.parse(currentFavorites);
                checkIfFavorite(parsedFavorites);
            } catch (error) {
                console.error("Error al procesar favoritos actuales:", error);
            }
        }
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [dishId, restaurantId]);
    
    const handleFavorite = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            alert("Debes iniciar sesión para guardar favoritos.");
            return;
        }
        
        
        setIsFavorite(!isFavorite);
        setAnimating(true);
        setTimeout(() => setAnimating(false), 300);
        
        try {
            if (!isFavorite) {
                
                const result = await actions.addFavorite(dishId, restaurantId);
                if (!result.success) {
                    throw new Error(result.message || "Error al añadir favorito");
                }
            } else {
                
                const favorites = Array.isArray(store.favorites) ? store.favorites : [];
                const favorite = favorites.find(fav => {
                    const favDishId = fav.dish_id !== undefined ? parseInt(fav.dish_id) : null;
                    const favRestaurantId = fav.restaurant_id !== undefined ? parseInt(fav.restaurant_id) : null;
                    
                    return (dishId && favDishId === dishId) || 
                           (restaurantId && favRestaurantId === restaurantId);
                });
                
                if (favorite) {
                    const result = await actions.removeFavorite(favorite.id);
                    if (!result.success) {
                        throw new Error(result.message || "Error al eliminar favorito");
                    }
                } else {
                    
                    await actions.fetchFavorites();
                }
            }
        } catch (error) {
            console.error("Error al gestionar favorito:", error);
            setIsFavorite(!isFavorite); 
            
            
            await actions.fetchFavorites();
        }
    };
    
    return (
        <button 
            onClick={handleFavorite}
            className={`favorite-button ${animating ? 'animating' : ''}`}
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            data-testid={`favorite-button-${restaurantId || dishId}`}
        >
            <i className={`fa-heart ${isFavorite ? "fas" : "far"}`} />
        </button>
    );
};

export default FavoriteButton;