import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Form, Button } from "react-bootstrap";

const SignUpClient = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [deparments, setDepartments] = useState([])
    const [cities, setCities] = useState([])


    const [registration, setRegistration] = useState({
        'email': '', 'username': '', 'password': '', 'phone': '', 'department': { 'id': '', "name": '' }, 'city': { 'id': '' }
    })


    const onLoad = async () => {
        const data = await actions.getDepartments()
        setDepartments(data)
    }

    const handleRegister = (event) => {
        const { name, value } = event.target;
        setRegistration((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleDepartment = (event) => {
        const { value, selectedIndex } = event.target
        if (value) {
            const selectedDepartment = event.target.options[selectedIndex].text
            setRegistration((prevState) => ({ ...prevState, department: { 'id': value, 'name': selectedDepartment } }));
            setRegistration((prevState) => ({ ...prevState, city: { 'id': '', "name": '' } }));

        }
    }

    const handleSelectCity = (event) => {
        const { value, selectedIndex } = event.target
        const selectedCity = event.target.options[selectedIndex].text
        setRegistration((prevState) => ({ ...prevState, city: { 'id': value, 'name': selectedCity } }));
    }

    const handleCities = async (department) => {
        const cities = await actions.getCities(department.id)
        setCities(cities)
    }

    const handleSubmission = async (e) => {
        e.preventDefault();
        const response = await actions.registerUser('client', registration)
        if (response) navigate(`/client-dashboard`)
    }


    useEffect(() => {
        onLoad()
    }, [])


    useEffect(() => {
        if (registration.department.id) {
            handleCities(registration.department)
        }
    }, [registration.department])

    return (
        <Form>
            <Form.Group className="mb-3" controlId="Email">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" placeholder="Ingresa un correo electrónico" value={registration.email} name='email' onChange={handleRegister} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Username">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control type="text" placeholder="Ingresa un nombre de usuario" value={registration.username} name='username' onChange={handleRegister} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" placeholder="Ingresa una contraseña, mínimo 4 caracteres" value={registration.password} name='password' onChange={handleRegister} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Address">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="number" placeholder="ej. 3007022000"
                    value={registration.phone} name='phone' onChange={handleRegister} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Address">
                <Form.Label>Ubicación</Form.Label>
                <Form.Select aria-label="Departments" onChange={handleDepartment}>
                    <option value=''>Selecciona un departamento</option>
                    {
                        deparments?.map((dep, index) => (
                            <option key={index} value={dep.id}>{dep.name}</option>
                        ))
                    }
                </Form.Select>
                <Form.Select aria-label="Cities" onChange={handleSelectCity} disabled={cities.length === 0}>
                    <option value=''>Selecciona una ciudad</option>
                    {
                        cities?.map((city, index) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))
                    }
                </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmission}>
                Registrarme
            </Button>
        </Form>)

}


export default SignUpClient


