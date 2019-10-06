CREATE DATABASE ezcooking;
GRANT ALL ON ezcooking.* to 'ezcooking'@'localhost' identified by 'ezcookingpw';
USE ezcooking;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    role VARCHAR(1) NOT NULL
);

CREATE TABLE category_unit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    short_name VARCHAR(5) NOT NULL UNIQUE,
    unit INT NOT NULL
);

CREATE TABLE category_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE category_subcategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category INT NOT NULL,
    FOREIGN KEY(category) REFERENCES category_category(id)
);

CREATE TABLE category_difficulty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE dish(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    duration TIME NOT NULL,
    short_description VARCHAR(255) NOT NULL,
    image_name VARCHAR(255),
    preparation TEXT NOT NULL,
    creation_date DATETIME NOT NULL,
    duration_unit INT NOT NULL,
    creator_id INT NOT NULL,
    category INT NOT NULL,
    subcategory INT NOT NULL,
    difficulty INT NOT NULL,
    FOREIGN KEY(duration_unit) REFERENCES category_unit(id),
    FOREIGN KEY(creator_id) REFERENCES users(id),
    FOREIGN KEY(category) REFERENCES category_category(id),
    FOREIGN KEY(subcategory) REFERENCES category_subcategory(id),
    FOREIGN KEY(difficulty) REFERENCES category_difficulty(id)
);

CREATE TABLE ingredient(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE dish_ingredients(
    id INT AUTO_INCREMENT PRIMARY KEY,
    count INT NOT NULL,
    dish_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    count_unit INT NOT NULL,
    FOREIGN KEY(dish_id) REFERENCES dish(id),
    FOREIGN KEY(ingredient_id) REFERENCES ingredient(id),
    FOREIGN KEY(count_unit) REFERENCES category_unit(id)
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  dish_id INT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(dish_id) REFERENCES dish(id)
);