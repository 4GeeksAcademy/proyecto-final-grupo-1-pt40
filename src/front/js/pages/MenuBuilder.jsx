import React, { useState, useEffect } from "react";
import { Button, Form, ListGroup, Card } from "react-bootstrap";

const MenuBuilder = () => {
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("categories")) || [];
  });
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState(() => {
    return JSON.parse(localStorage.getItem("dishes")) || [];
  });
  const [newDish, setNewDish] = useState({ name: "", image: "", description: "", price: "" });

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("dishes", JSON.stringify(dishes));
  }, [dishes]);

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const removeCategory = (category) => {
    setCategories(categories.filter(cat => cat !== category));
    setDishes(dishes.filter(dish => dish.category !== category));
    if (selectedCategory === category) setSelectedCategory(null);
  };

  const addDish = () => {
    if (newDish.name && newDish.image && newDish.price && selectedCategory) {
      setDishes([...dishes, { ...newDish, id: Date.now(), category: selectedCategory }]);
      setNewDish({ name: "", image: "", description: "", price: "" });
    }
  };

  const removeDish = (dishId) => {
    setDishes(dishes.filter(dish => dish.id !== dishId));
  };

  return (
    <div className="d-flex">
      <div className="w-25 p-3 border-end">
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
      </div>

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
          {dishes
            .filter((dish) => dish.category === selectedCategory)
            .map((dish, index) => (
              <Card key={index} style={{ width: "18rem" }} className="m-2">
                <Card.Img variant="top" src={dish.image} />
                <Card.Body>
                  <Card.Title>{dish.name}</Card.Title>
                  <Card.Text>{dish.description}</Card.Text>
                  <Card.Text><strong>Precio:</strong> {dish.price}</Card.Text>
                  <Button variant="danger" size="sm" onClick={() => removeDish(dish.id)}>Eliminar</Button>
                </Card.Body>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuBuilder;
