import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Card, Row, Col, Form, Button, Badge, Spinner } from "react-bootstrap";
import RestaurantCard from "../component/RestaurantCard.jsx";


const ExplorePage = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [deparments, setDepartments] = useState([])
    const [cities, setCities] = useState([])
    const [search, setSearch] = useState({ 'department': '', "city": '', "cuisine": '', "keyword": '' })
    const [searchOn, setSearchOn] = useState({ 'department': false, 'city': false, 'cuisine': false, 'keyword': false })
    const [top, setTop] = useState({})


    const setOne = ["Colombiana", "Americana", "Peruana", "Mexicana", "Brasileña"]
    const setTwo = ["Italiana", "Española", "Griega", "Francesa", "Turca"]
    const setThree = ["Japonesa", "China", "Coreana", "Tailandesa", "Vietnamita", "India", "Árabe"]
    const setFour = ["Pizza", "Hamburguesas", "Hot Dogs", "Tacos", "Comida Rápida", "Otras"]
    const cuisine = [...setOne, ...setTwo, ...setThree, ...setFour]
    const onLoad = async () => {
        const data = await actions.getDepartments()
        setDepartments(data)
        const response = await actions.topRestaurants()
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


    if (Object.keys(top) === 0) {
        return (
            <Container>
                <Row>
                    <Spinner animation="border" variant="danger" />
                </Row>
            </Container>
        )
    }


    return (


        <Container>
            <h1>Top Restaurantes en {top.city}</h1>
            <Row className="flex-nowrap overflow-auto p-3" style={{ whiteSpace: 'nowrap' }}>
                {top.restaurant && top.restaurant.length > 0 ? (
                    top.restaurant.map((res, index) => (
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
                    ))
                ) : (
                    <Col className="d-inline-block">
                        <div>No se encontraron restaurantes</div>
                    </Col>
                )}


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
                        <RestaurantCard data={res}/>
                    </Col>
                ))}

            </Row>

        </Container >
    )

};

export default ExplorePage;