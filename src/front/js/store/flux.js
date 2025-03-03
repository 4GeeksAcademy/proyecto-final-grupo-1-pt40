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
            registerRestaurant: async (userType, email, password, username, department, city, name, schedule, cuisine_type, exact_address, social_networks, phone, description, image) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                const endpoint = `${backendUrl}/api/register/${userType}`.replace(/([^:]\/)\/+/g, "$1");

                try {
                    console.log("Enviando horario al backend:", JSON.stringify(schedule));
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password, username, department, city, name, schedule, cuisine_type, exact_address, social_networks, phone, description, image }),
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

            loginUser: async (userType, email, password) => {
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
            menuBuilderLoad: async (menu_id) => {
                const store = getStore()
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/menu/${menu_id}`);
                    if (!response.ok) throw new Error("Error al cargar el menú");

                    const data = await response.json();
                    setStore({ ...store, menuBuilder: data });
                    return true;
                } catch (error) {
                    console.error("Error en menuBuilderLoad:", error);
                    return false;
                }
            },

            menuBuilderCategories: async (menu_id, categories) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/menu/categories`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 'menu_id': menu_id, 'categories': categories })
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

            menuBuilderAddDish: async (menu_id, dishInfo, category) => {
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
                                'menu_id': menu_id, 'category': category,
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

            menuBuilderDeleteDish: async (dish_id, category) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/delete/dish/${dish_id}`,
                        {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    const updatedDishes = { ...store.menuBuilder.dishes };
                    updatedDishes[category] = updatedDishes[category].filter(dish => dish.id !== dish_id);


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

            menuBuilderEditDish: async (dish_id, dishInfo, category) => {
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
                                'dish_id': dish_id, 'categories': category,
                                'name': name, 'description': description, 'price': price, 'image_URL': image
                            })
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    const updatedDish = await response.json()

                    const updatedDishes = { ...store.menuBuilder.dishes };

                    updatedDishes[category] = updatedDishes[category].map(dish =>
                        dish.id === dish_id ? updatedDish : dish
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

            menuViewLoad: async (menu_id) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/menu/${menu_id}`);
                    if (!response.ok) throw new Error("Error al cargar la vista del menú");

                    const data = await response.json();

                    setStore({ ...store, menu: data });
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
                        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
                        body: JSON.stringify({ name: menuInfo['name'], currency: menuInfo['currency'] })
                    }
                    )
                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }
                    const data = await response.json()
                    localStorage.setItem('menu_id', data.id)
                    return data
                }
                catch (error) {
                    console.error('Error creating menu', error);
                }
            },

            deleteMenu: async (menu_id) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/delete/menu/${menu_id}`,
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

            publishMenu: async (menu_id) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/publish/menu/${menu_id}`,
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

            unpublishMenu: async (menu_id) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/unpublish/menu/${menu_id}`,
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

            getMenuByRestaurant: async (restaurant_id) => {
                if (!restaurant_id) {
                    console.error("Error: restaurant_id es undefined");
                    return;
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurant/menus/${restaurant_id}`);
                    if (!response.ok) throw new Error("Error al obtener el menú");

                    const data = await response.json();
                    setStore({ menuRestaurant: data });
                } catch (error) {
                    console.error("Error fetching menu:", error);
                }
            },

            getMenuDetails: async (menu_id) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/menus/${menu_id}`);
                    if (!response.ok) throw new Error("Failed to fetch menu details");

                    const menuDetails = await response.json();
                    setStore({ ...getStore(), currentMenuDetails: menuDetails });
                } catch (error) {
                    console.error("Error loading menu details:", error);
                }
            },

            fetchFavorites: async (client_id) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                try {
                    const response = await fetch(`${backendUrl}/api/favorites/${client_id}`, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    const data = await response.json();
                    setStore({ favorites: data });
                } catch (error) {
                    console.error("Error al obtener favoritos:", error);
                }
            },


            addFavorite: async (client_id, menu_id, dish_id, restaurant_id) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                try {
                    const response = await fetch(`${backendUrl}/api/favorites`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({ client_id, menu_id, dish_id, restaurant_id }),
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

            removeFavorite: async (client_id, menu_id, dish_id, restaurant_id) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                try {
                    const response = await fetch(`${backendUrl}/api/favorites`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({ client_id, menu_id, dish_id, restaurant_id }),
                    });

                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }

                    const store = getStore();
                    setStore({
                        favorites: store.favorites.filter(fav =>
                            fav.menu_id !== menu_id &&
                            fav.dish_id !== dish_id &&
                            fav.restaurant_id !== restaurant_id
                        )
                    });
                } catch (error) {
                    console.error("Error al eliminar favorito:", error);
                }
            },

            getRestaurantDetails: async (restaurant_id) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurant_id}`);

                    if (!response.ok) {
                        throw new Error("No se pudo obtener la información del restaurante");
                    }

                    const data = await response.json();
                    console.log("Datos recibidos del backend:", data);
                    setStore({ restaurantDetails: data });

                    return data;
                } catch (error) {
                    console.log("Error al obtener los detalles del restaurante:", error);
                    return null;
                }
            },

            updateRestaurant: async (restaurant_id, updatedData) => {
                try {
                    if (!process.env.BACKEND_URL) {
                        console.error("Error: BACKEND_URL no está definido en las variables de entorno.");
                        return false;
                    }

                    const id = Number(restaurant_id);
                    if (isNaN(id) || id <= 0) {
                        console.error("Error: restaurant_id debe ser un número válido:", restaurant_id);
                        return false;
                    }

                    if (!updatedData || typeof updatedData !== "object" || Array.isArray(updatedData)) {
                        console.error("Error: updatedData debe ser un objeto JSON válido:", updatedData);
                        return false;
                    }

                    // ✅ Verifica si updatedData.schedule tiene el formato esperado
                    if (updatedData.schedule && (!updatedData.schedule.week || !updatedData.schedule.weekend)) {
                        console.error("❌ Error: El objeto 'schedule' no tiene la estructura correcta.");
                        return false;
                    }

                    // ✅ Construcción segura de la URL
                    const url = `${process.env.BACKEND_URL.replace(/\/$/, "")}/api/restaurants/${id}`;
                    console.log("URL de la solicitud PUT:", url);

                    // ✅ Enviar la petición
                    const response = await fetch(url, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedData)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`Error en la API (${response.status}):`, errorText);
                        return false;
                    }

                    console.log("✅ Restaurante actualizado correctamente.");
                    return true;
                } catch (error) {
                    console.error("❌ Error actualizando restaurante:", error);
                    return false;
                }
            },



        }
    }

}

export default getState;