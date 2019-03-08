CREATE DATABASE ezCooking;
GRANT ALL ON ezCooking.* to 'ezCooking'@'localhost' identified by 'asdfg';
USE ezCooking;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    role VARCHAR(1) NOT NULL);

INSERT INTO users (name, password, role) VALUES ('admin', 'adminpw', 'A');
INSERT INTO users (name, password, role) VALUES ('user1', 'userpw', 'U');