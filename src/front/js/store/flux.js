const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            client: {},
            restaurant: {},
            menuBuilder: { 'menu': { 'categories': [] } },
            menu: {},
            favorites: [],
            menuList: [],
            restaurantMenu: [],
            menuRestaurant: [],
            restaurants: []
        },
        actions: {
            registerUser: async (userType, email, password, username, department, city) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                const endpoint = `${backendUrl}/api/register/${userType}`.replace(/([^:]\/)\/+/g, "$1");

                try {
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password, username, department, city }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(`Error en la solicitud: ${response.status} ${response.statusText}`, errorData);
                        return false;
                    }

                    const data = await response.json();
                    localStorage.setItem(`${userType}`, data.id)
                    return true;
                } catch (error) {
                    console.error("Error en la solicitud:", error.message);
                    return false;
                }
            },

            loginUser: async (userType, email, password, navigate) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                const endpoint = `${backendUrl}/api/login/${userType}`.replace(/([^:]\/)\/+/g, "$1");

                try {
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(`Error en la solicitud: ${response.status} ${response.statusText}`, errorData);
                        return false;
                    }

                    const data = await response.json();


                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("userRole", userType);

                    if (userType === "client") {
                        sessionStorage.setItem("client", data.id);
                    } else if (userType === "restaurant") {
                        sessionStorage.setItem("restaurant", data.id);
                    }

                    return true;
                } catch (error) {
                    console.error("Error en la solicitud:", error.message);
                    return false;
                }
            },
            menuBuilderLoad: async (menuID) => {
                const store = getStore()
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/menu/${menuID}`);
                    if (!response.ok) throw new Error("Error al cargar el menú");

                    const data = await response.json();
                    setStore({ ...store, menuBuilder: data });
                    return true;
                } catch (error) {
                    console.error("Error en menuBuilderLoad:", error);
                    return false;
                }
            },

            menuBuilderCategories: async (menuID, categories) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/menu/categories`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 'menuID': menuID, 'categories': categories })
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }
                    const menuDetails = await response.json()
                    setStore({ ...store, menuBuilder: { ...store.menuBuilder, menu: menuDetails } });
                    return true
                }
                catch (error) {
                    console.error('Error loading Menu Builder categories', error);
                    return false
                }
            },

            menuBuilderAddDish: async (menuID, dishInfo, category) => {
                const name = dishInfo['name']
                const description = dishInfo['description']
                const price = dishInfo['price']
                const image = dishInfo['image']
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/new/dish`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                'menuID': menuID, 'category': category,
                                'name': name, 'description': description, 'price': price, 'image': image
                            })
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    const dish = await response.json()

                    const updatedDishes = { ...store.menuBuilder.dishes }

                    if (Array.isArray(updatedDishes[dish.category])) {
                        updatedDishes[dish.category].push(dish);
                    } else {
                        updatedDishes[dish.category] = [dish];
                    }
                    setStore({ ...store, menuBuilder: { ...store.menuBuilder, dishes: updatedDishes } });

                    return dish;
                }
                catch {
                    console.error('Error adding Menu Builder dish');
                }
            },

            menuBuilderDeleteDish: async (dishID, category) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/delete/dish/${dishID}`,
                        {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    const updatedDishes = { ...store.menuBuilder.dishes };
                    updatedDishes[category] = updatedDishes[category].filter(dish => dish.id !== dishID);


                    setStore({
                        ...store,
                        menuBuilder: {
                            ...store.menuBuilder,
                            dishes: updatedDishes,
                        },
                    });
                }
                catch {
                    console.error('Error deleting Menu Builder dish');
                }
            },

            menuBuilderEditDish: async (dishID, dishInfo, category) => {
                const backendURL = process.env.BACKEND_URL
                const name = dishInfo['name']
                const description = dishInfo['description']
                const price = dishInfo['price']
                const image = dishInfo['image']
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/edit/dish`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                'dishID': dishID, 'categories': category,
                                'name': name, 'description': description, 'price': price, 'image_URL': image
                            })
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    const updatedDish = await response.json()

                    const updatedDishes = { ...store.menuBuilder.dishes };

                    updatedDishes[category] = updatedDishes[category].map(dish =>
                        dish.id === dishID ? updatedDish : dish
                    );

                    setStore({
                        menuBuilder: {
                            ...store.menuBuilder,
                            dishes: updatedDishes,
                        },
                    });
                }
                catch (error) {
                    console.error('Error loading Menu Builder categories', error);
                }
            },

            menuViewLoad: async (menuID) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/menu/${menuID}`);
                    if (!response.ok) throw new Error("Error al cargar la vista del menú");

                    const data = await response.json();
                    setStore({...store, menu: data });
                    return true;
                } catch (error) {
                    console.error("Error en menuViewLoad:", error);
                    return false;
                }
            },

            createMenu: async (menuInfo) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/new/menu`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: menuInfo['name'], restaurantID: menuInfo['restaurantID'], currency: menuInfo['currency'] })
                    }
                    )
                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }
                    const data = await response.json()
                    localStorage.setItem('menuID', data.id)
                    return data
                }
                catch (error) {
                    console.error('Error creating menu', error);
                }
            },

            deleteMenu: async (menuID) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/delete/menu/${menuID}`,
                        {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    return true
                }
                catch {
                    console.error('Error deleting Menu ')
                }
            },

            publishMenu: async (menuID) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/publish/menu/${menuID}`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" }
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    return true
                }
                catch {
                    console.error('Error publishing Menu');
                }
            },

            unpublishMenu: async (menuID) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/unpublish/menu/${menuID}`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" }
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    return true
                }
                catch {
                    console.error('Error publishing Menu');
                }
            },

            getRestaurants: async () => {
                try {

                    const response = await fetch(process.env.BACKEND_URL + "api/restaurants");
                    if (!response.ok) throw new Error("Failed to fetch restaurants");

                    const restaurants = await response.json();
                    setStore({ ...getStore(), restaurants });
                    console.log("Restaurantes obtenidos:", restaurants);
                } catch (error) {
                    console.error("Error loading restaurants:", error);


                }
            },

            getRestaurantMenus: async (id) => {
                const store = getStore()
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/restaurant/menus/${id}`);
                    if (!response.ok) throw new Error("Error al obtener los menús");

                    const data = await response.json();
                    setStore({ ...store, restaurantMenus: data });
                    return true;
                } catch (error) {
                    console.error("Error en getRestaurantMenus:", error);
                    return false;
                }
            },

            getMenuByRestaurant: async (restaurantId) => {
                if (!restaurantId) {
                    console.error("Error: restaurantId es undefined");
                    return;
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurant/menus/${restaurantId}`);
                    if (!response.ok) throw new Error("Error al obtener el menú");

                    const data = await response.json();
                    setStore({ menuRestaurant: data });
                } catch (error) {
                    console.error("Error fetching menu:", error);
                }
            },

            getMenuDetails: async (menuID) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/menus/${menuID}`);
                    if (!response.ok) throw new Error("Failed to fetch menu details");

                    const menuDetails = await response.json();
                    setStore({ ...getStore(), currentMenuDetails: menuDetails });
                } catch (error) {
                    console.error("Error loading menu details:", error);
                }
            },

            fetchFavorites: async (clientId) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                try {
                    const response = await fetch(`${backendUrl}/api/favorites/${clientId}`);

                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    const data = await response.json();
                    setStore({ favorites: data });
                } catch (error) {
                    console.error("Error al obtener favoritos:", error);
                }
            },


            addFavorite: async (clientId, dishId) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                try {
                    const response = await fetch(`${backendUrl}/api/favorites`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ client_id: clientId, dish_id: dishId }),
                    });

                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    const newFavorite = await response.json();
                    const store = getStore();
                    setStore({ favorites: [...store.favorites, newFavorite] });
                } catch (error) {
                    console.error("Error al agregar favorito:", error);
                }
            },

            removeFavorite: async (favoriteId) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                try {
                    const response = await fetch(`${backendUrl}/api/favorites/${favoriteId}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    const store = getStore();
                    setStore({ favorites: store.favorites.filter(fav => fav.id !== favoriteId) });
                } catch (error) {
                    console.error("Error al eliminar favorito:", error);
                }
            },

        }
    }

}

export default getState;