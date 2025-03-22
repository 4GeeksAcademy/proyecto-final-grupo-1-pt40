import React, { useState, useEffect, useContext, useRef } from "react";
import { Button, Form, ListGroup, Card, Col, Row, Container, Stack } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Context } from "../store/appContext";
import { Widget } from "@uploadcare/react-widget";
import EditModal from "../component/EditModal.jsx"
import { useParams } from 'react-router-dom';
import RestaurantNavbar from "../component/RestaurantNavbar.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import '../../styles/menu-builder.css'



const MenuBuilder = () => {
  const { menuID } = useParams();
  const { store, actions } = useContext(Context);
  const [widgetKey, setWidgetKey] = useState(1)
  const [categories, setCategories] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newDish, setNewDish] = useState({ name: "", description: "", price: "", category: "", image: null });
  const [loaded, setLoaded] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const onLoad = async () => {
    if (!menuID) {
      console.error("Error:menuID es undefined");
      return;
    }
    if (await actions.menuBuilderLoad(menuID)) {
      setLoaded(true);
      setCategories(store.menuBuilder.menu.categories);
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  const saveCategoryName = (oldName) => {
    if (!editedCategoryName.trim()) return;

    const oldCategories = [...categories];
    const updatedCategories = categories.map(cat =>
      cat === oldName ? editedCategoryName : cat
    );



    console.log("Enviando a menuBuilderCategories:", {
      menuID,
      updatedCategories,
      oldCategories
    });

    actions.menuBuilderCategories(menuID, updatedCategories, oldCategories);

    setCategories(updatedCategories);
    setEditingCategory(null);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditedCategoryName("");
  };


  const updateCategories = async (oldCats = null) => {
    if (oldCats) {
      console.log("Enviando categorías antiguas:", oldCats);
      console.log("Enviando categorías nuevas:", categories);
      await actions.menuBuilderCategories(menuID, categories, oldCats);
    } else {

      await actions.menuBuilderCategories(menuID, categories);
    }
  }

  const addCategory = async () => {
    if (!newCategory || categories.includes(newCategory)) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const removeCategory = async (category) => {
    setCategories(categories.filter(cat => cat !== category));
    if (selectedCategory === category) setSelectedCategory(null);
  };


  const addDish = async () => {
    if (newDish.name && newDish.price && selectedCategory) {
      await actions.menuBuilderAddDish(menuID, newDish, selectedCategory)
      setNewDish({ name: "", description: "", price: "", category: "", image: null });
      setWidgetKey(prev => prev + 1)
    }
  };

  const handleFileChange = (file) => {
    setNewDish({ ...newDish, image: file.cdnUrl })
  }

  const removeDish = async (menuID, dishID, category) => {
    console.log("Intentando eliminar:", { menuID, dishID, category });
    if (!dishID || !menuID || !category) {
      console.error("Error: Falta un parámetro", { menuID, dishID, category });
      return;
    }
    await actions.menuBuilderDeleteDish(dishID, category);
  };
  useEffect(() => {
    onLoad()
  }, [])

  useEffect(() => {
    if (loaded && !editingCategory) updateCategories();
  }, [categories, editingCategory])

  useEffect(() => {
    setNewDish({ name: "", description: "", price: "", category: "", image: null })
    setWidgetKey(prev => 1 + prev)
  }, [selectedCategory])

  return (
    <div>
      <RestaurantNavbar />
      <Container className="d-flex" fluid>

        <Row className="w-100">
          {Object.keys(store.menuBuilder).length > 0 && store.menuBuilder.menu.categories ?

            <Col sm='12' md='12' lg='4' className="p-3 border-end">
              <h2 className="text-orange fw-bold ">Categorías</h2>
              {store.menuBuilder.menu.categories.length > 0 ?
                (<ListGroup className="mt-3">
                  {categories?.map((category, index) => (
                    <ListGroup.Item key={index} className={`d-flex justify-content-between align-items-center fs-5 py-3 fw-bold ${category === selectedCategory ? "bg-orange" : ''}`}>
                      {editingCategory === category ? (
                        <>
                          <input
                            type="text"
                            value={editedCategoryName}
                            onChange={(e) => setEditedCategoryName(e.target.value)}
                            className="form-control form-input fs-5"
                            style={{ width: "70%" }}
                          />
                          <div>
                            <Button variant="success" size="sm" onClick={() => saveCategoryName(category)}><FontAwesomeIcon className="fw-bold fs-5" icon={faCheck} /></Button>
                            <Button variant="danger" size="sm" onClick={cancelEditing} className="ms-2 px-2 align-middle"><FontAwesomeIcon className="fw-bold fs-5" icon={faXmark} /></Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span onClick={() => setSelectedCategory(category)} className={`${category === selectedCategory ? "text-white" : ''}`} style={{ cursor: "pointer" }}>{category}</span>
                          <div>
                            <Button variant="warning" size="sm" className="px-2" onClick={() => startEditing(category)}><FontAwesomeIcon className='text-dark fs-5' icon={faPenToSquare} /></Button>
                            <Button variant="danger" size="sm" onClick={() => removeCategory(category)} className="ms-2 px-2 py-1"><FontAwesomeIcon className="fs-5" icon={faTrash} /></Button>
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>) : (
                  <div>No hay categorías en este momento</div>)}
              <Form.Control className="mt-3 py-2 fs-5 form-input"
                type="text"
                placeholder="Nueva categoría"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <div className="mt-3 d-flex justify-content-center">
                <Button className="gray-button fw-bold fs-5" onClick={addCategory}>Agregar Categoría</Button>
              </div>
            </Col> : <Spinner animation="border" variant="danger" />}

          <Col sm md lg='8' className="p-3">
            <h4 className="text-orange fw-bold">{selectedCategory ? `Agregar Platillo a ${selectedCategory}` : "Seleccione una categoría"}</h4>
            {selectedCategory && (
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Nombre del Platillo"
                  value={newDish.name}
                  className="mt-3 form-input"
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                />
                <div className="mt-2">
                  <Widget publicKey='47bd03853371888b5541' onChange={handleFileChange} key={widgetKey} />
                </div>
                <Form.Control
                  as="textarea"
                  placeholder="Descripción del Platillo"
                  className="mt-2 form-input"
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                />
                <Form.Control
                  type="text"
                  placeholder="Precio del Platillo"
                  className="mt-2 form-input"
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                />
                <div className="d-flex justify-content-center mt-3">
                  <Button className=" gray-button fs-5 fw-bold" onClick={addDish}>Agregar Platillo</Button>
                </div>
              </Form>
            )}

            <h4 className="mt-4 text-orange fw-bold">Platillos</h4>
            {selectedCategory && (<div>
              <Row className="mt-3 g-0 w-100 px-3 d-flex justify-content-center">
                {store.menuBuilder.dishes ? (
                  Array.isArray(store.menuBuilder.dishes[selectedCategory]) ? (
                    store.menuBuilder.dishes[selectedCategory]?.length > 0 ? (
                      store.menuBuilder.dishes[selectedCategory].map((dish, index) => (
                        <Card className="my-2 menu-builder-dish-card" key={index}>
                          <Row className="w-100 h-100 m-0">
                            {dish.image &&
                              <Col xs='12' md='4' lg='4' className="p-0 m-0 ">
                                <Card.Img src={dish.image} alt='Sin imagen' className="menu-builder-img m-auto" />
                              </Col>
                            }
                            <Col xs="12" md={dish.image ? "6" : "10"} lg={dish.image ? "6" : "10"} className="m-auto h-100 ">
                              <Card.Body>
                                <Card.Title>{dish.name}</Card.Title>
                                <Card.Text>{dish.description}</Card.Text>
                                <Card.Text><strong>Precio:</strong> {`${dish.price} ${store.menuBuilder.menu.currency}`}</Card.Text>
                              </Card.Body>
                            </Col>
                            <Col xs md='2' lg='2' className="d-flex justify-content-center align-middle mb-2">
                              <Stack direction="horizontal" gap={2} className="d-flex justify-content-center align-middle mb-3">
                                <EditModal dish={dish} />
                                <Button variant="danger" className="d-inline-block p-2" size="md" onClick={() => removeDish(menuID, dish.dish_id, dish.category)}>
                                  <FontAwesomeIcon className="fs-5" icon={faTrash} />
                                </Button>
                              </Stack>
                            </Col>
                          </Row>
                        </Card>
                      ))
                    ) : (
                      <p>Aun no hay platillos en esta categoría</p>
                    )
                  ) : (
                    <p>Aun no hay platillos en esta categoría</p>
                  )
                ) : (
                  <Spinner animation="border" variant="danger" />)}
              </Row>
            </div>)}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MenuBuilder;
