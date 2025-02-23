"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, Response,send_file
from werkzeug.utils import secure_filename
from api.models import db, Client, Restaurant, Menu, Dish
from sqlalchemy.exc import DataError
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import os
from io import BytesIO

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


MIME_TYPES = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif'
}

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
@api.route('/register/client', methods=['POST'])
def client_registration():
    data = request.json
    email = data.get('email')
    username =  data.get('username')
    password = data.get('password')
    department = data.get('department')
    city = data.get('city')

    not_unique_email = Client.query.filter_by(email=email).first()
    not_unique_username = Client.query.filter_by(username=username).first()

    if not_unique_email:
        return jsonify({"error": 'Email is already in use'}),400
    if not_unique_username:
        return jsonify({"error":'Username is already in use'}),400
    
    try:
        new_client = Client(email=email, username=username, department=department,city=city)
        new_client.set_password(password)
        db.session.add(new_client)
        db.session.commit()
        return jsonify({"message":"User registered correctly"}), 201
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/register/restaurant', methods=['POST'])
def restaurant_registration():
    data = request.json
    email = data.get('email')
    username =  data.get('username')
    password = data.get('password')
    department = data.get('department')
    city = data.get('city')
    not_unique_email = Restaurant.query.filter_by(email=email).first()
    not_unique_username = Restaurant.query.filter_by(username=username).first()

    if not_unique_email:
        return jsonify({"error": 'Email is already in use'}),400
    if not_unique_username:
        return jsonify({"error":'Username is already in use'}),400
    
    try:
        new_restaurant = Restaurant(email=email, username=username, department=department,city=city)
        new_restaurant.set_password(password)
        db.session.add(new_restaurant)
        db.session.commit()
        return jsonify({"message":"Restaurant registered correctly"}), 201
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500


@api.route('/login/client', methods=['POST'])
def client_login(): 
    data = request.json
    email = data.get('email', None)
    username =  data.get('username',None)
    password = data.get('password')
    if email:
        client = Client.query.filter_by(email=email).first()
    elif username:
        client = Client.query.filter_by(username=username).first()
    else:
        return jsonify({"error":"Complete login information"}),400
    try:
        if client:
            login = client.check_password(password)
            if login:
                return({"message":"Allowed"}), 201
            else:
                return({"message":"Check your username/email and password"}),400
        return ({"message":"Email/username not found"}),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/login/restaurant', methods=['POST'])
def restaurant_login():
    data = request.json
    email = data.get('email', None)
    username =  data.get('username',None)
    password = data.get('password')
    if email:
        restaurant = Restaurant.query.filter_by(email=email).first()
    elif username:
        restaurant = Restaurant.query.filter_by(username=username).first()
    else:
        return jsonify({"error":"Complete login information"}),400
    try:
        if restaurant:
            login = restaurant.check_password(password)
            if login:
                return({"message":"Allowed"}), 201
            else:
                return({"message":"Check your username/email and password"}),400
        return ({"message":"Email/username not found"}),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/new/menu', methods=['POST'])
def add_menu():
    data = request.json
    try:
        if data["name"] and data["restaurantID"]:
            new_menu = Menu(name=data["name"], restaurantID=data["restaurantID"])
            db.session.add(new_menu)
            db.session.commit()
            response = new_menu.serialize()
            return jsonify(response), 201
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/delete/menu/<int:menu_id>', methods=['DELETE'])
def delete_menu(menu_id):
    try:
        if menu_id:
            delete_menu = Menu.query.filter_by(id = menu_id).first()
            if not delete_menu:
                return jsonify('Bad Request: Menu not found'), 400
            db.session.delete(delete_menu)
            db.session.commit()
            return jsonify('Successfully deleted menu'), 201
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/new/dish/', methods=['POST'])
def add_dish():
    data = request.json
    description = data.get('description',None)
    try:
        if data["name"] and data["category"] and data["price"] and data["menuID"]:
            new_dish = Dish(name=data['name'], category=data['category'], price=float(data["price"]),menuID=data["menuID"],description=description)
            if new_dish:
                db.session.add(new_dish)
                db.session.commit()
                return jsonify(new_dish.serialize()), 201
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500


@api.route('/add/dish/image/<int:dishID>', methods=['POST'])
def add_image(dishID):
    if 'image' not in request.files:
        return jsonify({'BadRequest':'File not found in request'}),400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'BadRequest':'Image not found in request'}),400
    
    filename = secure_filename(file.filename)
    _, ext = os.path.splitext(filename)
    ext = ext.lower().replace('.', '')
    if ext not in MIME_TYPES:
        return jsonify({'BadRequest': 'Unsupported file extension'}), 400

    image_stream = BytesIO(file.read())
    image_bytes = image_stream.getvalue()
    try:
        get_dish = Dish.query.filter_by(id=dishID).first()
        if get_dish:
            get_dish.image_data = image_bytes
            get_dish.extension = ext
            db.session.commit()
        return jsonify(get_dish.serialize()), 201
   
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/dish/images/<string:category>', methods=['GET'])
def get_image(category): 
    response = [];
    try:
       dishes = Dish.query.filter_by(category=category).order_by(Dish.id).all()
       for dish in dishes:
        image_record = Images.query.filter_by(dishID=dish.id).first()
        if image_record:
            response.append({'dishID':dish.id,'image_data':image_record.image_data.hex()})
        return jsonify(response),200
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/delete/dish/<int:dish_id>', methods=['DELETE'])
def delete_dish(dish_id):
    try:
        if dish_id:
            delete_dish = Dish.query.filter_by(id=dish_id).first()
            if delete_dish:
                db.session.delete(delete_dish)
                db.session.commit()
                return jsonify('Dish has been deleted'), 201
            else:
                return jsonify('Dish not found'), 400
        else:
             return jsonify('Bad Request: Request is missing data/fields'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/edit/dish', methods=['PUT'])
def edit_dish():
    data = request.get_json()
    try:
        edit_dish = Dish.query.filter_by(id=data["dishID"]).first()
        if edit_dish:
            for key, value in data.items():
                if hasattr(edit_dish, key):
                    if value:
                        setattr(edit_dish,key,value)
            db.session.commit()
            return jsonify(edit_dish.serialize()),200
        else:
             return jsonify('Bad Request: Dish ID not found'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500
    
@api.route('/menu/categories', methods=['PUT'])
def menu_categories():
    data = request.get_json()
    menuID = data.get('menuID')
    categories_list = data.get('categories',None)
    try:
        menu = Menu.query.filter_by(id=menuID).first()
        if menu:
            menu.set_categories(categories_list)
            db.session.commit()
            return jsonify(menu.serialize()),200
        else:
             return jsonify('Bad Request: Menu ID not found'),400
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/menu/<int:menu_id>', methods=['GET'])
def get_menu(menu_id):
    try:
        menu = Menu.query.filter_by(id=menu_id).first()
        if menu:
            categories = menu.get_categories()
            if categories == 'No categories at the moment':
                return jsonify(menu.serialize()), 201
            menu_response = {"menu":menu.serialize()}
            dish_list = {}
            for category in categories:
                dishes = Dish.query.filter_by(menuID=menu_id, category=category).order_by(Dish.id).all()
                if dishes:
                    dish_list[category] = [dish.serialize() for dish in dishes]
                else:
                    dish_list[category] = 'No dishes in this category'
            return jsonify({**menu_response,**{'dishes':dish_list}}),201
        else:
            return jsonify('Menu ID not found'),401
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500

@api.route('/restaurants', methods=['GET'])
def get_restaurants():
    try:
        restaurants=Restaurant.query.all()
        if restaurants:
            res_list = [res.serialize() for res in restaurants]
            return jsonify(res_list),201
        else:
            return jsonify('Restaurants not found'),401
    except DataError as e:
        db.session.rollback()
        return jsonify('Bad Request: Incorrect data format/type'),400
    except Exception as e:
         db.session.rollback()
         return jsonify('Server error: Failed to process request'), 500