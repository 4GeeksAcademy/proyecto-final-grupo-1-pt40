const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: {
                username: "",
                email: "",
                password: "",
				city:"",
				department:""
            },
            isAuthenticated: false,
            errorMessage: "",
        },

        actions: {
            /**
             * Actualiza el estado del formulario de registro
             */
            handleInputChange: (event) => {
                const { name, value } = event.target;
                const store = getStore();
                setStore({
                    user: {
                        ...store.user,
                        [name]: value, // Actualiza dinámicamente el campo correspondiente
                    }
                });
            },

            /**
             * Envía los datos del formulario al backend para registrar el usuario
             */
            registerUser: async () => {
                const store = getStore();
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(store.user),
                };

                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/register/client", requestOptions);
                    const data = await response.json();

                    if (response.ok) {
                        // Guardar el usuario en localStorage y actualizar el estado de autenticación
                        localStorage.setItem("user", JSON.stringify(data.user));
                        setStore({ isAuthenticated: true, errorMessage: "" });
                    } else {
                        setStore({ errorMessage: data.message || "Error en el registro" });
                    }
                } catch (error) {
                    console.error("Error en el registro:", error);
                    setStore({ errorMessage: "Error al conectar con el servidor" });
                }
            },

            /**
             * Verifica si el usuario está autenticado al cargar la aplicación
             */
            checkAuthStatus: () => {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    setStore({ isAuthenticated: true, user: JSON.parse(storedUser) });
                }
            },

            /**
             * Cierra la sesión del usuario
             */
            logout: () => {
                localStorage.removeItem("user");
                setStore({
                    user: { name: "", email: "", password: "" },
                    isAuthenticated: false
                });
            }
        }
    };
};

export default getState;
