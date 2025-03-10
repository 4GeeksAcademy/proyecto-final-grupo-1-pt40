const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            client: null,
            restaurant: {},
            menuBuilder: {},
            menu: {},
            favorites: [],
            menuList: [],
            restaurantMenu: [],
            menuRestaurant: [],
            restaurants: [],
            top: [],
            search: [],
            notificaciones: [
                "Nueva reserva en Restaurante A",
                "Restaurante B ha actualizado su menú",
                "Nuevo comentario en Restaurante A",
            ],
            notificacionesSeleccionadas: [],
            solicitudes: [], // Lista de solicitudes (reportes)
        },
        actions: {
            registerUser: async (userType, registration) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                const endpoint = `${backendUrl}api/register/${userType}`;

                try {
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ ...registration, department: registration.department.name, city: registration.city.name }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(`Error en la solicitud: ${response.status} ${response.statusText}`, errorData);
                        return false;
                    }

                    const data = await response.json();
                    sessionStorage.setItem('token', data.token)
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


                    const profileResp = await fetch(`${backendUrl}/api/profile`, {
                        headers: { Authorization: `Bearer ${data.token}` }
                    });


                    if (!profileResp.ok) return false;

                    const userData = await profileResp.json();
                    console.log("Datos del perfil del usuario:", userData);

                    setStore({ client: userData });

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

                    setStore({ ...store, menuBuilder: { ...store.menuBuilder, dishes: updatedDishes } });
                }
                catch (error) {
                    console.error('Error deleting Menu Builder dish', error);
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

                    setStore({ ...store, menuBuilder: { ...store.menuBuilder, dishes: updatedDishes } });
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
                catch (error) {
                    console.error('Error deleting Menu', error)
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
                catch (error) {
                    console.error('Error publishing Menu', error);
                }
            },

            getRestaurants: async () => {
                try {

                    const response = await fetch(`${process.env.BACKEND_URL}api/restaurants`,);
                    if (!response.ok) throw new Error("Failed to fetch restaurants");

                    const restaurants = await response.json();
                    setStore({ ...getStore(), restaurants });
                    console.log("Restaurantes obtenidos:", restaurants);
                } catch (error) {
                    console.error("Error loading restaurants:", error);


                }
            },

            getRestaurantMenus: async () => {
                const store = getStore()
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/restaurant/menus`, {
                        method: 'GET',
                        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                    });
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

            fetchFavorites: async () => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                const store=getStore();
                
                try {
                    const response = await fetch(`${backendUrl}api/favorites`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        },
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    setStore({ favorites: data });
                    return data;
                } catch (error) {
                    console.error("Error al obtener favoritos:", error);
                    return [];
                }
            },
            


            addFavorite: async (dish_id, restaurant_id) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                console.log("Valores recibidos:", { dish_id, restaurant_id });
                let bodyData = {};
                if (dish_id !== null && dish_id !== undefined) {
                    bodyData.dish_id = parseInt(dish_id);
                } 
                if (restaurant_id !== null && restaurant_id !== undefined) {
                    bodyData.restaurant_id = parseInt(restaurant_id);
                }
                
                if (Object.keys(bodyData).length === 0) {
                    console.error("Error: Se debe proporcionar al menos un dish_id o restaurant_id válido");
                    return;
                }

                    console.log("Datos a enviar:", bodyData);

                try {
                    const url=`${backendUrl}api/favorites`;
                    console.log("URL a utilizar:",url);
                    const response = await fetch(`${backendUrl}api/favorites`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        },
                      body: JSON.stringify(bodyData),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error("Respuesta del servidor:", errorText);
                        if (errorText.includes("ya esta en tus favoritos")){
                            console.log("este elemento ya esta en tus favoritos");
                            return null;
                        }
                        throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
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
                    const response = await fetch(`${backendUrl}api/favorites/${favoriteId}`, {
                        method: "DELETE",
                        headers:{
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                        }
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

            getRestaurantDetails: async () => {
                const store = getStore()
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/restaurant/profile`, {
                        method: 'GET',
                        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo obtener la información del restaurante");
                    }

                    const data = await response.json();
                    console.log("Datos recibidos del backend:", data);
                    setStore({ ...store, restaurantDetails: data });

                    return data;
                } catch (error) {
                    console.log("Error al obtener los detalles del restaurante:", error);
                    return null;
                }
            },

            updateRestaurant: async (registration) => {
                try {
                    if (!process.env.BACKEND_URL) {
                        console.error("Error: BACKEND_URL no está definido en las variables de entorno.");
                        return false;
                    }

                    const url = `${process.env.BACKEND_URL}api/restaurant/profile`;
                    console.log("URL de la solicitud PUT:", url);

                    const response = await fetch(url, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },
                        body: JSON.stringify({ ...registration, department: registration.department.name, city: registration.city.name })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`Error en la API (${response.status}):`, errorText);
                        return false;
                    }
                    console.log(" Restaurante actualizado correctamente.");
                    return true;
                } catch (error) {
                    console.error("Error actualizando restaurante:", error);
                    return false;
                }
            },

            //Actions para explora y descrubre
            getDepartments: async () => {
                try {
                    const response = await fetch('https://api-colombia.com/api/v1/Department')

                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }

                    const data = await response.json()

                    const departments = data.map(element => {
                        return { 'name': element.name, 'id': element.id }
                    });

                    return departments
                } catch (error) {
                    console.error("Error fetching departments", error);
                }
            },

            getCities: async (department_id) => {
                try {
                    const response = await fetch(`https://api-colombia.com/api/v1/Department/${department_id}/cities`)

                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    const data = await response.json()
                    const cities = data.map(element => {
                        return { 'name': element.name, 'id': element.id }
                    });

                    return cities
                } catch (error) {
                    console.error("Error fetching cities", error);
                }

            },

            searchRequest: async (search) => {
                const store = getStore()
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/search`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...search, department: search.department.name, city: search.city.name })
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    const data = await response.json()
                    setStore({ ...store, search: data });
                    return true
                } catch (error) {
                    console.error("Error with search query", error);
                }

            },


            resetSearch: () => {
                const store = getStore()
                setStore({ ...store, search: [] })

            },

            topRestaurants: async (city) => {
                const store = getStore()
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/top-restaurants/${city}`, {
                        method: 'GET',
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    const data = await response.json()
                    return data;
                } catch (error) {
                    console.error("Error with search query", error);
                }

            },

            // Acción para eliminar un restaurante (o producto)
            deleteRestaurant: async (restaurantId) => {
                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                try {
                    const response = await fetch(`${backendUrl}/api/restaurants/${restaurantId}`, {
                        method: "DELETE"
                    });
                    if (!response.ok) throw new Error("Failed to delete restaurant");
                    const store = getStore();
                    const updatedRestaurants = store.restaurants.filter(r => r.id !== restaurantId);
                    setStore({ ...store, restaurants: updatedRestaurants });
                    return true;
                } catch (error) {
                    console.error("Error deleting restaurant:", error);
                    return false;
                }
            },
            //Agrega actions despues de esta linea

            getClientDetails: async () => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}api/client/profile`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo obtener la información del cliente");
                    }

                    const data = await response.json();
                    console.log("Datos del cliente recibidos del backend:", data);
                    setStore({ ...store, clientDetails: data });

                    return data;
                } catch (error) {
                    console.log("Error al obtener los detalles del cliente:", error);
                    return null;
                }
            },

            updateClient: async (registration) => {
                try {
                    if (!process.env.BACKEND_URL) {
                        console.error("Error: BACKEND_URL no está definido en las variables de entorno.");
                        return false;
                    }

                    const url = `${process.env.BACKEND_URL}api/client/profile`;
                    console.log("URL de la solicitud PUT:", url);

                    // Prepare data to send, excluding password if empty
                    const dataToSend = {
                        department: registration.department,
                        city: registration.city,
                    };
                    if (registration.password) {
                        dataToSend.password = registration.password;
                    }

                    const response = await fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(dataToSend),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`Error en la API (${response.status}):`, errorText);
                        return false;
                    }
                    console.log("Cliente actualizado correctamente.");
                    return true;
                } catch (error) {
                    console.error("Error actualizando cliente:", error);
                    return false;
                }
            },

            manejarSeleccionNotificacion: (index) => {
                const store = getStore();
                if (store.notificacionesSeleccionadas.includes(index)) {
                    // Si ya está seleccionada, la eliminamos
                    setStore({
                        notificacionesSeleccionadas: store.notificacionesSeleccionadas.filter((i) => i !== index),
                    });
                } else {
                    // Si no está seleccionada, la agregamos
                    setStore({
                        notificacionesSeleccionadas: [...store.notificacionesSeleccionadas, index]
                    })
                }
            },

            // Acción para agregar una nueva solicitud (reporte)
            agregarSolicitud: (destinatario, mensaje) => {
                const store = getStore();
                const nuevaSolicitud = {
                    id: store.solicitudes.length + 1,
                    destinatario,
                    mensaje,
                    fecha: new Date().toLocaleString(),
                };
                setStore({
                    solicitudes: [...store.solicitudes, nuevaSolicitud],
                });
            },

            // Acción para eliminar una notificación
            eliminarNotificacion: (index) => {
                const store = getStore();
                const nuevasNotificaciones = store.notificaciones.filter((_, i) => i !== index);
                setStore({
                    notificaciones: nuevasNotificaciones,
                });
            },

            // Acción para marcar una notificación como leída
            marcarNotificacionComoLeida: (index) => {
                const store = getStore();
                const notificacionesActualizadas = store.notificaciones.map((notificacion, i) =>
                    i === index ? `✅ ${notificacion}` : notificacion
                );
                setStore({
                    notificaciones: notificacionesActualizadas,
                });
            },
        }
    };
};


export default getState;
