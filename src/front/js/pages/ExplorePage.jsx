import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Card, Row, Col, Form, Button, Badge, Spinner } from "react-bootstrap";
import RestaurantCard from "../component/RestaurantCard.jsx";
import ClientNavbar from "../component/ClientNavbar.jsx";
import MainNavbar from "../component/MainNavbar.jsx";


const ExplorePage = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [deparments, setDepartments] = useState([])
    const [cities, setCities] = useState([])
    const [search, setSearch] = useState({ 'department': '', "city": '', "cuisine": '', "keyword": '' })
    const [searchOn, setSearchOn] = useState({ 'department': false, 'city': false, 'cuisine': false, 'keyword': false })
    const [disable, setDisable] = useState(false)
    const [top, setTop] = useState({})
    const [isLogged, setIsLogged] = useState(null)


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
            setSearchOn((prevState) => ({ ...prevState, department: true }))

        }
    }

    const handleSelectCity = (event) => {
        const { value, selectedIndex } = event.target
        const selectedCity = event.target.options[selectedIndex].text
        setSearch((prevState) => ({ ...prevState, city: { 'id': value, 'name': selectedCity } }));
        setSearchOn((prevState) => ({ ...prevState, city: true }))
    }

    const handleSelectCuisine = (event) => {
        const { value, selectedIndex } = event.target
        if (value) {
            const selectedCuisine = event.target.options[selectedIndex].text
            setSearch((prevState) => ({ ...prevState, cuisine: selectedCuisine }));
            setSearchOn((prevState) => ({ ...prevState, cuisine: true }))
        }
    }
    const handleCities = async (department) => {
        const cities = await actions.getCities(department.id)
        setCities(cities)
    }

    const handleKeyword = (e) => {
        e.persist()
        setSearch((prev) => ({ ...prev, keyword: e.target.value }))
        setSearchOn((prevState) => ({ ...prevState, keyword: true }))
    }

    const handleSubmission = async (e) => {
        e.preventDefault();
        setDisable(true)
        await actions.searchRequest(search)


    }

    const handleReset = () => {
        setSearchOn({ 'department': false, 'city': false, 'cuisine': false, 'keyword': false })
        setDisable(false)
        setSearch({ 'department': { id: '', name: '' }, "city": { id: '', name: '' }, "cuisine": '', "keyword": '' })
        actions.resetSearch()
    }

    const checkLogged = async () => {
        const clientStatus = await actions.checkClient()
        if (clientStatus) {
            await actions.fetchFavorites()
            setIsLogged(true)
        } else {
            setIsLogged(false)
        }
    }

    useEffect(() => {
        checkLogged()
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

        <div>
            {isLogged ? <ClientNavbar /> : <MainNavbar />}
            <Container>
                {isLogged ? (
                    <>
                        <h1 className="mb-4 fw-bold text-orange">TOP RESTAURANTES EN: {top.city}</h1>
                        <Row className="flex-nowrap overflow-auto p-3" style={{ whiteSpace: 'nowrap' }}>
                            {top.restaurants && top.restaurants.length > 0 ? (
                                top.restaurants.map((res, index) => (
                                    <Col key={index} className="d-inline-block">
                                        <RestaurantCard data={res} />
                                    </Col>
                                ))
                            ) : (
                                <Col className="d-inline-block">
                                    <div>No se encontraron restaurantes</div>
                                </Col>
                            )}
                        </Row>
                    </>
                ) : (
                    <h1 className="mb-4 fw-bold text-orange">Inicia sesión para ver mejores restaurantes de tu ciudad</h1>
                )}

                <Form className="mt-4 mb-4">
                    <Row className="d-flex justify-content-center g-3">
                        <Col xs={12} md={6} lg={3}>
                            <Form.Group className="mb-3" controlId="Address">
                                <Form.Select aria-label="Departments" onChange={handleDepartment} disabled={disable} value={search.department.id} className="form-select-custom">
                                    <option value=''>Departamento</option>
                                    {
                                        deparments?.map((dep, index) => (
                                            <option key={index} value={dep.id}>{dep.name}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6} lg={2}>
                            <Form.Group>
                                <Form.Select aria-label="Cities" onChange={handleSelectCity} disabled={disable} value={search.city.id} className="form-select-custom">
                                    <option value=''>Ciudad</option>
                                    {
                                        cities?.map((city, index) => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6} lg={2}>
                            <Form.Group>
                                <Form.Select aria-label="Cuisine" onChange={handleSelectCuisine} disabled={disable} value={search.cuisine} className="form-select-custom">
                                    <option value=''>Estilo</option>
                                    {
                                        cuisine?.map((cuisine, index) => (
                                            <option key={index} value={cuisine}>{cuisine}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6} lg={4}>
                            <Form.Group className="mb-3" controlId="Search Bar">
                                <Form.Control type="text" placeholder="Buscar por restaurante o palabra clave" value={search.keyword} name='keyword' onChange={handleKeyword} disabled={disable} className="search-input-custom" />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={12} lg={1} className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" onClick={handleSubmission} className="menu-button" >
                                Buscar
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Row className="mb-4" >
                    <h3 className="fw-bold text-orange" >FILTROS</h3>
                    <div className="d-flex flex-wrap">
                        {Object.entries(search).map((param, index) => {
                            if (param[1] && searchOn[param[0]]) {
                                if (typeof param[1] === 'string') {
                                    return <div bg='secondary' className="m-2 orange-button rounded d-flex px-2 align-middle align-items-center" key={index}>{param[1]}</div>
                                } else {
                                    return <div bg="secondary" className="m-2 orange-button  d-flex rounded px-2 align-middle align-items-center" key={index}>{param[1].name}</div>
                                }
                            }
                            return
                        }

                        )}
                        <Button variant="danger" onClick={handleReset} className="m-2">Eliminar Filtros</Button>
                    </div>
                </Row>
                <Row className="g-4 justify-content-center">
                    {disable ? (
                        store.search && store.search.length > 0 ? (
                            store.search.map((res, index) => (
                                <Col
                                    key={index}
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    className="justify-content-center"
                                >
                                    <RestaurantCard data={res} />
                                </Col>
                            ))
                        ) : (
                            <div className="text-orange fw-bold">No se encontraron restaurantes</div>
                        )
                    ) : (
                        <div className="text-orange fw-bold">
                            Usa los filtros para buscar restaurantes
                        </div>
                    )}


                </Row>

            </Container >
        </div >
    )

};

export default ExplorePage;