import React, { useState, useEffect, useContext } from "react";
import { Button, Form, ListGroup, Card } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Context } from "../store/appContext";

const MenuBuilder = () => {
  const { store, actions } = useContext(Context);
  const [categories, setCategories] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState(null);
  const [newDish, setNewDish] = useState({ name: "", image: "", description: "", price: "", category: "" });


  const onLoad = async () => {
    await actions.menuBuilderLoad(3)
    setCategories(store.menuBuilder.menu.categories)
    setDishes(store.menuBuilder.dishes)
  }

  const editCategories = async () => {
    await actions.menuBuilderCategories(3, categories)
  }

  useEffect(() => {
    onLoad()
  }, [])

  useEffect(() => {
    if (categories) editCategories();
  }, [categories])


  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      await actions.menuBuilderCategories(3, categories)
    }
  };

  const removeCategory = async (category) => {
    setCategories(categories.filter(cat => cat !== category));
    setDishes(prevCat => {
      const newCat = { ...prevCat }
      delete newCat[category]
      return newCat
    });
    if (selectedCategory === category) setSelectedCategory(null);
  };

  const addDish = async () => {
    if (newDish.name && newDish.price && selectedCategory) {
      const dishResult = await actions.menuBuilderAddDish(3, { ...newDish }, selectedCategory)
      setDishes({ ...dishes, [selectedCategory]: [...dishes[selectedCategory], dishResult] });
      setNewDish({ name: "", image: "", description: "", price: "", category: "" });
    }
  };

  const removeDish = async (dishID) => {
    setDishes(dishes[selectedCategory].filter(dish => dish.id !== dishID));
    await actions.menuBuilderDeleteDish(dishID)
  };

  const convertImage = async (file) => {
    return await actions.imageToBase64(file)
  }

  return (
    <div className="d-flex">
      {categories ? <div className="w-25 p-3 border-end">
        <h4>Categorías</h4>
        <ListGroup>
          {categories.map((category, index) => (
            <ListGroup.Item key={index} action onClick={() => setSelectedCategory(category)} className="d-flex justify-content-between align-items-center">
              <span>{category}</span>
              <Button variant="danger" size="sm" onClick={() => removeCategory(category)}>X</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Form.Control
          type="text"
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button className="mt-2" onClick={addCategory}>Agregar Categoría</Button>
      </div> : <Spinner animation="border" variant="danger" />}

      <div className="w-75 p-3">
        <h4>{selectedCategory ? `Agregar Platillo a ${selectedCategory}` : "Seleccione una categoría"}</h4>
        {selectedCategory && (
          <Form>
            <Form.Control
              type="text"
              placeholder="Nombre del Platillo"
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            />
            <Form.Control
              type="file"
              className="mt-2"
              onChange={(e) => setNewDish({ ...newDish, image: URL.createObjectURL(e.target.files[0]) })}
            />
            <Form.Control
              as="textarea"
              placeholder="Descripción del Platillo"
              className="mt-2"
              value={newDish.description}
              onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
            />
            <Form.Control
              type="text"
              placeholder="Precio del Platillo"
              className="mt-2"
              value={newDish.price}
              onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
            />
            <Button className="mt-2" onClick={addDish}>Agregar Platillo</Button>
          </Form>
        )}

        <h4 className="mt-4">Platillos</h4>

        <div className="d-flex flex-wrap">
          {dishes ? (Array.isArray(dishes[selectedCategory]) ?
            (dishes[selectedCategory]?.map((dish, index) => (
              <Card key={index} style={{ width: "18rem" }} className="m-2">
                <Card.Img variant="top" src={dish.image} />
                <Card.Body>
                  <Card.Title>{dish.name}</Card.Title>
                  <Card.Text>{dish.description}</Card.Text>
                  <Card.Text><strong>Precio:</strong> {dish.price}</Card.Text>
                  <Button variant="danger" size="sm" onClick={() => removeDish(dish.id)}>Eliminar</Button>
                </Card.Body>
              </Card>)
            )) : (<p>Aun no hay platillos en esta categoría</p>)) : <Spinner animation="border" variant="danger" />}
        </div>
      </div>
    </div>
  );
};

export default MenuBuilder;
