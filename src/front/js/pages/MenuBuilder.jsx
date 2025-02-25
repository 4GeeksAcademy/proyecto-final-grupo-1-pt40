import React, { useState, useEffect, useContext } from "react";
import { Button, Form, ListGroup, Card } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Context } from "../store/appContext";
import { Widget } from "@uploadcare/react-widget";
import EditModal from "../component/EditModal.jsx"
import { useParams } from 'react-router-dom';


const MenuBuilder = () => {
  const { menuID } = useParams();
  const { store, actions } = useContext(Context);
  const [categories, setCategories] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState(null);
  const [newDish, setNewDish] = useState({ name: "", description: "", price: "", category: "", image: "" });


  const onLoad = async () => {
    if (await actions.menuBuilderLoad(menuID)) {
      setCategories(store.menuBuilder.menu.categories)
    }
  }

  const editCategories = async () => {
    if (categories) {
      await actions.menuBuilderCategories(menuID, categories)
    }
  }

  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
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
      await actions.menuBuilderAddDish(menuID, newDish, selectedCategory)
      setNewDish({ name: "", description: "", price: "", category: "", image: "" });
    }
  };

  const handleFileChange = (file) => {
    setNewDish({ ...newDish, image: file.cdnUrl })
  }

  const removeDish = async (dishID) => {
    await actions.menuBuilderDeleteDish(menuID, dishID, selectedCategory)
  };

  useEffect(() => {
    onLoad()
  }, [])

  useEffect(() => {
    if (categories) editCategories();
  }, [categories])

  return (
    <div className="d-flex">
      {store.menuBuilder.menu && store.menuBuilder.menu.categories ? <div className="w-25 p-3 border-end">
        <h4>Categorías</h4>
        {store.menuBuilder.menu.categories.length > 0 ?
          (<ListGroup>
            {store.menuBuilder.menu.categories?.map((category, index) => (
              <ListGroup.Item key={index} action onClick={() => setSelectedCategory(category)} className="d-flex justify-content-between align-items-center">
                <span>{category}</span>
                <Button variant="danger" size="sm" onClick={() => removeCategory(category)}>X</Button>
              </ListGroup.Item>))}
          </ListGroup>) : (
            <div>No hay categorías en este momento</div>)}
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
            <Widget publicKey='47bd03853371888b5541' onChange={handleFileChange} />
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

        {selectedCategory && (<div>
          <div className="d-flex flex-wrap">
            {store.menuBuilder.dishes ? (
              Array.isArray(store.menuBuilder.dishes[selectedCategory]) ? (
                store.menuBuilder.dishes[selectedCategory]?.length > 0 ? (
                  store.menuBuilder.dishes[selectedCategory].map((dish, index) => (
                    <Card key={index} style={{ width: "18rem" }} className="m-2">
                      <Card.Img variant="top" src={dish.image} />
                      <Card.Body>
                        <Card.Title>{dish.name}</Card.Title>
                        <Card.Text>{dish.description}</Card.Text>
                        <Card.Text><strong>Precio:</strong> {dish.price}</Card.Text>
                        <EditModal dish={dish} />
                        <Button variant="danger" size="sm" onClick={() => removeDish(dish.id)}>Eliminar</Button>
                      </Card.Body>
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
          </div>
        </div>)}

      </div>
    </div>
  );
};

export default MenuBuilder;
