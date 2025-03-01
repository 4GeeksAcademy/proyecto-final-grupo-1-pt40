import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import ScheduleSelector from "./ScheduleSelector.jsx";
import axios from "axios";
import { Widget } from "@uploadcare/react-widget";


const SignUp = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();


    const [userType, setUserType] = useState("client");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState("");
    const [department, setDepartment] = useState(""); // ID del departamento
    const [departmentName, setDepartmentName] = useState(""); // Nombre del departamento
    const [departments, setDepartments] = useState([]);
    const [city, setCity] = useState(""); // ID de la ciudad
    const [cityName, setCityName] = useState(""); // Nombre de la ciudad
    const [cities, setCities] = useState([]);
    const [name, setName] = useState("");

    const [schedule, setSchedule] = useState({
        week: { open: "10:00 AM", close: "08:00 PM" },
        weekend: { open: "11:00 AM", close: "08:00 PM" }
    });

    const [cuisine_type, setCuisine_type] = useState("");
    const [exact_address, setExact_address] = useState("");
    const [social_networks, setSocial_networks] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");


    // Obtener departamentos
    useEffect(() => {
        axios.get("https://api-colombia.com/api/v1/Department")
            .then(response => setDepartments(response.data))
            .catch(error => console.error("Error al obtener departamentos:", error));
    }, []);

    // Obtener ciudades según el departamento seleccionado
    useEffect(() => {
        if (department) {
            axios.get(`https://api-colombia.com/api/v1/City?departmentId=${department}`)
                .then(response => setCities(response.data))
                .catch(error => console.error("Error al obtener ciudades:", error));
        } else {
            setCities([]);
        }
    }, [department]);

    // const handleFileChange = (file) => {
    //     setImage(file.cdnUrl);
    // };

    const handleFileChange = (file) => {
        console.log("Archivo subido:", file);
        if (file && file.cdnUrl) {
            setImage(file.cdnUrl);
            console.log("URL de la imagen:", file.cdnUrl);
        } else {
            console.error("Error: No se obtuvo una URL válida.");
        }
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        console.log("Horario antes de enviar:", schedule);
        if (userType && email && password && username && department && city) {
            const response = await actions.registerRestaurant(userType, email, password, username, departmentName, cityName, name, schedule, cuisine_type, exact_address, social_networks, phone, description, image);
            if (response) navigate(`/${userType}-dashboard`)
        }
    };

    return (
        <div className=" form container mt-4">
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${userType === "client" ? "active" : ""}`}
                        onClick={() => setUserType("client")}
                    >
                        Sign up as a client
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${userType === "restaurant" ? "active" : ""}`}
                        onClick={() => setUserType("restaurant")}
                    >
                        Registrarse como un restaurante
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${userType === "client" ? "show active" : ""}`}>
                    <form onSubmit={handleSubmitRegister}>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username} onChange={(e) => setUserName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ciudad</label>
                            <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Departamento</label>
                            <input type="text" className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </form>
                </div>

                <div className={`tab-pane fade ${userType === "restaurant" ? "show active" : ""}`}>
                    <form onSubmit={handleSubmitRegister}>
                        <div className="mb-3">
                            <label className="form-label">Correo electronico</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nombre de usuario</label>
                            <input type="text" className="form-control" value={username} onChange={(e) => setUserName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Departamento</label>
                            <select
                                className="form-control"
                                value={department}
                                onChange={(e) => {
                                    const selectedDep = departments.find(dep => dep.id == e.target.value);
                                    setDepartment(e.target.value);
                                    setDepartmentName(selectedDep ? selectedDep.name : "");
                                }}
                                required
                            >
                                <option value="">Selecciona un departamento</option>
                                {departments.map(dep => (
                                    <option key={dep.id} value={dep.id}>{dep.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ciudad</label>
                            <select
                                className="form-control"
                                value={city}
                                onChange={(e) => {
                                    const selectedCity = cities.find(city => city.id == e.target.value);
                                    setCity(e.target.value);
                                    setCityName(selectedCity ? selectedCity.name : "");
                                }}
                                disabled={!department}
                                required
                            >
                                <option value="">Selecciona una ciudad</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nombre del restaurante</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Horario de atención</label>"
                            <ScheduleSelector onChange={setSchedule} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tipo de cocina</label>
                            <input type="text" className="form-control" value={cuisine_type} onChange={(e) => setCuisine_type(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Direccion</label>
                            <input type="text" className="form-control" value={exact_address} onChange={(e) => setExact_address(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Redes sociales</label>
                            <input type="text" className="form-control" value={social_networks} onChange={(e) => setSocial_networks(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Telefono</label>
                            <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripcion del restaurante</label>
                            <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Imagen del Restaurante</label>
                            <Widget publicKey='47bd03853371888b5541' onChange={handleFileChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;