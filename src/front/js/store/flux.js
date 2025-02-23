import { useParams } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            client: {},
            restaurant: {},
            menuBuilder: {},
            menu: {},
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
                const actions = getActions();
                try {
                    const response = await fetch(`${backendURL}api/menu/${menuID}`)
                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }
                    const menu = await response.json()
                    const menu_store = actions.transformImages(menu)

                    setStore({ ...store, menuBuilder: menu_store });
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
                }
                catch {
                    console.error('Error loading Menu Builder categories');
                }
            },

            menuBuilderAddDish: async (menuID, dishInfo, category) => {
                const name = dishInfo['name']
                const description = dishInfo['description']
                const price = dishInfo['price']
                const backendURL = process.env.BACKEND_URL
                const actions = getActions();
                const store = getStore();
                try {
                    const response = await fetch(`${backendURL}api/new/dish`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                'menuID': menuID, 'category': category,
                                'name': name, 'description': description, 'price': price
                            })
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }

                    let dish = await response.json()

                    if (dishInfo.image) {
                        dish = await actions.uploadImage(dishInfo.image, dish.id)
                    }

                    const dish_transform = actions.transformDish(dish)
                    const updatedDishes = { ...store.menuBuilder.dishes }

                    if (Array.isArray(updatedDishes[dish.category])) {
                        updatedDishes[dish.category].push(dish_transform);
                    } else {
                        updatedDishes[dish.category] = [dish_transform];
                    }
                    setStore({ ...store, menuBuilder: { ...store.menuBuilder, dishes: updatedDishes } });
                    
                    return dish_transform;
                }
                catch {
                    console.error('Error adding Menu Builder dish');
                }
            },

            menuBuilderDeleteDish: async (menuID, dishID) => {
                const backendURL = process.env.BACKEND_URL
                const actions = getActions();
                try {
                    const response = await fetch(`${backendURL}api/delete/dish/${dishID}`,
                        {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })

                    if (!response.ok) {
                        throw new Error(res.statusText);
                    }
                    await actions.menuBuilderLoad(menuID)
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

            uploadImage: async (imageFile, dishID) => {
                const backendURL = process.env.BACKEND_URL
                try {
                    const formData = new FormData();
                    formData.append('image', imageFile)
                    const response = await fetch(`${backendURL}api/add/dish/image/${dishID}`,
                        {
                            method: "POST",
                            body: formData
                        })
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status}`);
                    }
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error:', error);
                    throw error;
                }
            },

            transformImages: (menu) => {
                const menuINFO = menu['menu']
                const dishINFO = menu['dishes']
                const defaultImage = '/../img/rigo-baby.jpg'

                menuINFO['categories'].forEach(category => {
                    if (Array.isArray(dishINFO[category])) {
                        dishINFO[category] = dishINFO[category].map(dish => {
                            if (dish.image) {
                                const hexImage = dish.image;
                                try {
                                    const byteArray = new Uint8Array(hexImage.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                                    const blob = new Blob([byteArray], { type: `image/${dish.extension || 'jpeg'}` }); // Default to 'jpeg' if extension is missing
                                    const imageUrl = URL.createObjectURL(blob);
                                    dish.image = imageUrl;
                                } catch (error) {
                                    console.error('Error converting hex image:', error);
                                    dish.image = defaultImage;
                                }
                            } else {
                                dish.image = defaultImage;
                            }
                            return dish;
                        });
                    } else {
                        console.warn(`No array found for category: ${category}`);
                        dishINFO[category] = defaultImage;
                    }
                });

                return { menu: menuINFO, dishes: dishINFO };
            },

            transformDish: (dish) => {
                const defaultImage = '/../img/rigo-baby.jpg';
                if (dish.image) {
                    const hexImage = dish.image;
                    try {
                        const byteArray = new Uint8Array(hexImage.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                        const blob = new Blob([byteArray], { type: `image/${dish.extension || 'jpeg'}` }); // Default to 'jpeg' if extension is missing
                        const imageUrl = URL.createObjectURL(blob);
                        dish.image = imageUrl;
                    } catch (error) {
                        console.error('Error converting hex image:', error);
                        dish.image = defaultImage;
                    }
                } else {
                    dish.image = defaultImage;
                }
                console.log(dish.image)
                return dish;
            }

        }
    }

}

export default getState;