DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL -- holds department name
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL, -- holds role title
    salary DECIMAL NOT NULL, -- holds role salary
    department_id INT -- holds reference to department role belongs to
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, -- holds employee first name
    last_name VARCHAR(30) NOT NULL, -- holds employee last name
    role_id INT NOT NULL, -- holds reference to employee role
    manager_id INT -- holds reference to another employee that is the manager of the current employee
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL
);