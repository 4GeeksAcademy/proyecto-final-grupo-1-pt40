import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Widget } from "@uploadcare/react-widget";


const SignUpRestaurant = () => {

    const { store, actions } = useContext(Context);
    const [departments, setDepartments] = useState([])
    const [cities, setCities] = useState([])
    const [cuisines, setCuisines] = useState('')

    const [registration, setRegistration] = useState({
        'email': '', 'username': '', 'password': '', 'name': '', 'exact_address': '',
        'social_networks': '', 'phone': '', 'department': { 'id': '', "name": '' }, 'city': { 'id': '', "name": '' }, 'image': '', 'description': '',
        'cuisine_type': ''
    })
    const navigate = useNavigate()
    const setOne = ["Colombiana", "Americana", "Peruana", "Mexicana", "Brasileña"]
    const setTwo = ["Italiana", "Española", "Griega", "Francesa", "Turca"]
    const setThree = ["Japonesa", "China", "Coreana", "Tailandesa", "Vietnamita", "India", "Árabe"]
    const setFour = ["Pizza", "Hamburguesas", "Hot Dogs", "Tacos", "Comida Rápida", "Otras"]
    const cuisineSets = [setOne, setTwo, setThree, setFour]

    const [schedule, setSchedule] = useState({
        'Lunes': { open: "", close: "", isClosed: false },
        'Martes': { open: "", close: "", isClosed: false },
        'Miércoles': { open: "", close: "", isClosed: false },
        'Jueves': { open: "", close: "", isClosed: false },
        'Viernes': { open: "", close: "", isClosed: false },
        'Sábado': { open: "", close: "", isClosed: false },
        'Domingo': { open: "", close: "", isClosed: false }
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

    const handleCheckBox = (event) => {
        const { name, checked } = event.target
        if (checked) {
            if (cuisines.length < 1) {
                setCuisines(name)
            } else {
                alert('Solo puedes seleccionar 1 tipo de comida')
            }
        } else {
            setCuisines('')
        }
    }

    const scheduleChange = (day, field, event) => {
        const { checked, value } = event.target
        setSchedule((prev) =>
        ({
            ...prev, [day]: {
                ...prev[day],
                [field]: field === "isClosed" ? checked : value,
            }
        }))
    }

    const handleFileChange = (file) => {
        if (file) {
            setRegistration(prev => ({ ...prev, image: file.cdnUrl }));
        } else {
            alert("La imagen no se cargó correctamente");
        }
    };
    const handleSubmission = async (e) => {
        e.preventDefault();
        const response = await actions.registerUser('restaurant', registration)
        if (response) navigate(`/restaurant-dashboard`)
    }

    const formatSchedule = (dict) => {
        return Object.keys(dict).map((day) => ({ day, ...schedule[day] }))
    }

    useEffect(() => {
        setRegistration(prev => ({ ...prev, cuisine_type: cuisines }));
    }, [cuisines])

    useEffect(() => {
        onLoad()
    }, [])

    useEffect(() => {
        const formatted = formatSchedule(schedule)
        setRegistration(prev => ({ ...prev, schedule: formatted }));
    }, [schedule])

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
            <Form.Group className="mb-3" controlId="Email">
                <Form.Label>Nombre del Restaurante</Form.Label>
                <Form.Control type="text" placeholder="Ingresa el nombre del restaurante" value={registration.name} name='name' onChange={handleRegister} />
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
                        departments?.map((dep, index) => (
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

            <Form.Group className="mb-3" controlId="Address">
                <Form.Label>Dirección Física</Form.Label>
                <Form.Control type="text" placeholder="ej. calle, avenida, vía..." value={registration.exact_address} name='exact_address' onChange={handleRegister} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="Address">
                <Form.Label>Dirección a Perfil en Google Maps</Form.Label>
                <Form.Control type="text" placeholder="ej. https://www.google.com/maps/place/Burger+King+Chipichape/@3.4759614,-76.6030828,12z/data=!4m10!1m2!2m1!1sburger+kin!3m6!1s0x8e30a618f82bb8d1:0x41f8c19f53184316!8m2!3d3.4759664!4d-76.5273023!15sCgtidXJnZXIga2luZyIDiAEBWg0iC2J1cmdlciBraW5nkgEUaGFtYnVyZ2VyX3Jlc3RhdXJhbnTgAQA!16s%2Fg%2F1q5bmxvnb?hl=es&entry=ttu&g_ep=EgoyMDI1MDIyNi4xIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D"
                    value={registration.social_networks} name='social_networks' onChange={handleRegister} />
            </Form.Group>

            {Object.keys(schedule).map((day, index) => (
                <Form.Group as={Row} className="align-items-center" key={index}>
                    <Form.Label column sm="2">
                        {day}
                    </Form.Label>
                    <Col sm="3">
                        <Form.Control type="time"
                            value={schedule[day].open}
                            onChange={(e) => scheduleChange(day, "open", e)}
                            disabled={schedule[day].isClosed} />
                    </Col>

                    <Col sm="3">
                        <Form.Control type="time"
                            value={schedule[day].close}
                            onChange={(e) => scheduleChange(day, "close", e)}
                            disabled={schedule[day].isClosed} />
                    </Col>

                    <Col sm="2">
                        <Form.Check type="checkbox"
                            label="Closed"
                            checked={schedule[day].isClosed}
                            onChange={(e) => scheduleChange(day, "isClosed", e)} />
                    </Col>

                </Form.Group>
            ))}

            <Form.Group className="mb-3" controlId="Cuisine">
                <Form.Label>Selecciona un estilo de cocina</Form.Label>
                {<Row>
                    {cuisineSets.map((col, colIndex) => (
                        <Col sm={3} key={colIndex}>
                            {col.map((cuisine, index) => (
                                <Form.Check type="checkbox"
                                    label={cuisine}
                                    name={cuisine}
                                    id={`cuisine-${colIndex}-${index}`}
                                    key={`cuisine-${colIndex}-${index}`}
                                    onChange={handleCheckBox}
                                    checked={cuisines.includes(cuisine)} />
                            ))}
                        </Col>
                    ))}
                </Row>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="Description">
                <Form.Label>Descripción del Restaurante</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Escribe una pequeña reseña sobre el restaurante..." value={registration.description} name='description' onChange={handleRegister} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Image">
                <Form.Label>Escoge una imagen para tu restaurante</Form.Label>
                <Widget publicKey='47bd03853371888b5541' onChange={handleFileChange} />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={handleSubmission}>
                Registrar Restaurante
            </Button>
        </Form>
    );
};

export default SignUpRestaurant;