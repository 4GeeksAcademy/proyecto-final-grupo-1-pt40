import { useParams } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            client: {},
            restaurant: {},
            menuBuilder: {},
            menu: {}
        },
        actions: {
            registerUser: async (userType, email, password, username, department, city) => {
                console.log("Datos enviados:", userType, email, password, username, department, city);

                const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
                const endpoint = `${backendUrl}/api/register/${userType}`.replace(/([^:]\/)\/+/g, "$1");

                console.log("URL del backend:", endpoint);

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
                    console.log("Registro exitoso:", data);
                    return true;
                } catch (error) {
                    console.error("Error en la solicitud:", error.message);
                    return false;
                }
            },

            menuBuilderLoad: async (menuID) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/menu/${menuID}`)

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }
                    const menu = await response.json()
                    setStore({ ...store, menuBuilder: menu });
                    return true;
                }

                catch {
                    console.error('Error loading Menu Builder');
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
                    return true;
                }

                catch {
                    console.error('Error loading Menu Builder categories');
                }
            },

            menuBuilderAddDish: async (menuID, dishInfo, category) => {
                const name = dishInfo['name']
                const description = dishInfo['description']
                const price = dishInfo['price']
                const image = dishInfo['image']
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                const actions = getActions();
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
                    return dish;
                }
                catch {
                    console.error('Error adding Menu Builder dish');
                }
            },

            menuBuilderDeleteDish: async (dishID) => {
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
                    return true;
                }
                catch {
                    console.error('Error deleting Menu Builder dish');
                }
            },

            menuBuilderEditDish: async (dishID, name, description, price, image, category) => {
                const backendURL = process.env.BACKEND_URL
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/delete/dish/${dishID}`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                'dishID': dishID, 'categories': category,
                                'name': name, 'description': description, 'price': price, 'image': image
                            })
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }
                    return true;
                }
                catch {
                    console.error('Error loading Menu Builder categories', error);
                }
            },

            imageToBase64: async (file) => {
                try {
                    const response = await fetch(file);
                    const blob = await response.blob();
                    const reader = new FileReader();
                    return new Promise((resolve, reject) => {
                        reader.onload = () => resolve(reader.result.split(',')[1]);
                        reader.onerror = error => reject(error)
                        reader.readAsDataURL(blob);
                    })

                } catch (error) {
                    console.error("Error fetching blob")
                    throw error;
                }

            }




        }
    };
};

export default getState;