import { useParams } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {},
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
            }
        }
    };
};

export default getState;