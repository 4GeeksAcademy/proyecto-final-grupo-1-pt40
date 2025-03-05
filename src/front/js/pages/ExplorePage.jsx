import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Card, Row, Col, Form, Button, Badge } from "react-bootstrap";


const ExplorePage = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [deparments, setDepartments] = useState([])
    const [cities, setCities] = useState([])
    const [search, setSearch] = useState({ 'department': '', "city": '', "cuisine": '', "keyword": '' })
    const [searchOn, setSearchOn] = useState({ 'department': false, 'city': false, 'cuisine': false, 'keyword': false })
    const [top, setTop] = useState([])
    const sample = [
        {
            id: 1,
            nombre: "Restaurante A",
            direccion: "Calle 123, Ciudad",
            telefono: "123-456-7890",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 2,
            nombre: "Restaurante B",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },

        {
            id: 3,
            nombre: "Restaurante C",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 4,
            nombre: "Restaurante D",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 5,
            nombre: "Restaurante E",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 6,
            nombre: "Restaurante F",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 7,
            nombre: "Restaurante G",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 8,
            nombre: "Restaurante H",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 9,
            nombre: "Restaurante i",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
            id: 10,
            nombre: "Restaurante J",
            direccion: "Avenida 456, Ciudad",
            telefono: "987-654-3210",
            imagen: "https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
    ]

    const setOne = ["Colombiana", "Americana", "Peruana", "Mexicana", "Brasileña"]
    const setTwo = ["Italiana", "Española", "Griega", "Francesa", "Turca"]
    const setThree = ["Japonesa", "China", "Coreana", "Tailandesa", "Vietnamita", "India", "Árabe"]
    const setFour = ["Pizza", "Hamburguesas", "Hot Dogs", "Tacos", "Comida Rápida", "Otras"]
    const cuisine = [...setOne, ...setTwo, ...setThree, ...setFour]
    const onLoad = async () => {
        const data = await actions.getDepartments()
        setDepartments(data)
        const response = await actions.topRestaurants('Cali')
        setTop(response)
    }

    const handleDepartment = (event) => {
        const { value, selectedIndex } = event.target
        if (value) {
            const selectedDepartment = event.target.options[selectedIndex].text
            setSearch((prevState) => ({ ...prevState, department: { 'id': value, 'name': selectedDepartment } }));
            setSearch((prevState) => ({ ...prevState, city: { 'id': '', "name": '' } }));

        }
    }

    const handleSelectCity = (event) => {
        const { value, selectedIndex } = event.target
        const selectedCity = event.target.options[selectedIndex].text
        setSearch((prevState) => ({ ...prevState, city: { 'id': value, 'name': selectedCity } }));
    }

    const handleSelectCuisine = (event) => {
        const { value, selectedIndex } = event.target
        if (value) {
            const selectedCuisine = event.target.options[selectedIndex].text
            setSearch((prevState) => ({ ...prevState, cuisine: selectedCuisine }));
        }
    }
    const handleCities = async (department) => {
        const cities = await actions.getCities(department.id)
        setCities(cities)
    }

    const handleKeyword = (e) => {
        e.persist()
        setSearch((prev) => ({ ...prev, keyword: e.target.value }))
    }

    const handleSubmission = async (e) => {
        e.preventDefault();
        await actions.searchRequest(search)
        setSearchOn({ 'department': true, 'city': true, 'cuisine': true, 'keyword': true })

    }

    const handleReset = () => {
        setSearchOn({ 'department': false, 'city': false, 'cuisine': false, 'keyword': false })
        setSearch({ 'department': { id: '', name: '' }, "city": { id: '', name: '' }, "cuisine": '', "keyword": '' })
        actions.resetSearch()
    }

    useEffect(() => {
        onLoad()
    }, [])


    useEffect(() => {
        if (search.department.id) {
            handleCities(search.department)
        }
    }, [search.department])

    return (


        <Container>
            <h1>Top 10 en Cali</h1>
            <Row className="flex-nowrap overflow-auto p-3" style={{ whiteSpace: 'nowrap' }}>
                {top.map((res, index) => (
                    <Col key={index} className="d-inline-block">
                        <Card style={{ width: '250px', height: '200px' }}>
                            <Card.Img variant="top" src={res.image} alt={res.name} />
                            <Card.Body>
                                <Card.Title>{res.name}</Card.Title>
                                <Card.Text>{`${res.city}, ${res.department}`}</Card.Text>
                                <Card.Text><strong>Estilo:</strong>{res.cuisine_type}</Card.Text>
                                <Card.Text>{res.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Form className="mt-4">
                <Row className="d-flex justify-content-center">
                    <Col lg='3'>
                        <Form.Group className="mb-3" controlId="Address">
                            <Form.Select aria-label="Departments" onChange={handleDepartment} disabled={searchOn.department} value={search.department.id}>
                                <option value=''>Departamento</option>
                                {
                                    deparments?.map((dep, index) => (
                                        <option key={index} value={dep.id}>{dep.name}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col lg='2'>
                        <Form.Group>
                            <Form.Select aria-label="Cities" onChange={handleSelectCity} disabled={searchOn.city} value={search.city.id}>
                                <option value=''>Ciudad</option>
                                {
                                    cities?.map((city, index) => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col lg='2'>
                        <Form.Group>
                            <Form.Select aria-label="Cuisine" onChange={handleSelectCuisine} disabled={searchOn.cuisine} value={search.cuisine}>
                                <option value=''>Estilo</option>
                                {
                                    cuisine?.map((cuisine, index) => (
                                        <option key={index} value={cuisine}>{cuisine}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col lg='4'>
                        <Form.Group className="mb-3" controlId="Search Bar">
                            <Form.Control type="text" placeholder="Buscar por restaurante o palabra clave" value={search.keyword} name='keyword' onChange={handleKeyword} disabled={searchOn.keyword} />
                        </Form.Group>
                    </Col>

                    <Col lg='1'>
                        <Button variant="primary" type="submit" onClick={handleSubmission}>
                            Buscar
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Row>
                <h3>Filtros</h3>
                <div className="d-flex">
                    {Object.entries(search).map((param, index) => {
                        if (param[1] && searchOn[param[0]]) {
                            if (typeof param[1] === 'string') {
                                return <Badge bg="secondary" className="m-2" key={index}>{param[1]}</Badge>
                            } else {
                                return <Badge bg="secondary" className="m-2" key={index}>{param[1].name}</Badge>
                            }
                        }
                        return
                    }

                    )}
                    <Button variant="danger" onClick={handleReset}>Eliminar Filtros</Button>
                </div>
            </Row>
            <Row className="mt-4 justify-content-center">
                {store.search?.map((res, index) => (
                    <Col key={index} className="justify-content-center" lg='4'>
                        <Card style={{ width: '250px', height: '200px' }}>
                            <Card.Img variant="top" src={res.image} alt={res.name} />
                            <Card.Body>
                                <Card.Title>{res.name}</Card.Title>
                                <Card.Text>{`${res.city}, ${res.department}`}</Card.Text>
                                <Card.Text><strong>Estilo:</strong> {res.cuisine_type}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

            </Row>

        </Container >
    )

};

export default ExplorePage;