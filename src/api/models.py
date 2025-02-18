from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    favorites = relationship('Favorites', back_populates='client')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    schedule = db.Column(db.JSON, nullable=True)
    cuisine_type = db.Column(db.String(100), nullable=True)
    exact_address = db.Column(db.String(255), nullable=True)
    social_networks = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    description = db.Column(db.Text, nullable=True)

    menus = relationship('Menu', back_populates='restaurant')
    notifications = relationship('RestaurantNotifications', back_populates='restaurant')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created = db.Column(db.String(100), nullable=False)
    last_updated = db.Column(db.String(100), nullable=False)
    categories = db.Column(db.JSON, nullable=False)
    restaurant_id = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=False)

    restaurant = relationship('Restaurant', back_populates='menus')
    dishes = relationship('Dish', back_populates='menu')
    favorites = relationship('Favorites', back_populates='menu')

class Dish(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, ForeignKey('menu.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.LargeBinary, nullable=True)

    menu = relationship('Menu', back_populates='dishes')

class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, ForeignKey('menu.id'))
    user_id = db.Column(db.Integer, ForeignKey('client.id'))
    dish_id = db.Column(db.Integer, ForeignKey('dish.id'))

    client = relationship('Client', back_populates='favorites')
    menu = relationship('Menu', back_populates='favorites')
    dish = relationship('Dish')

class RestaurantNotifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, ForeignKey('restaurant.id'), nullable=True)
    created = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey('admin.id'), nullable=False)

    restaurant = relationship('Restaurant', back_populates='notifications')   

class ClientNotifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, ForeignKey('admin.id'))
    created = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Boolean, nullable=False)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
