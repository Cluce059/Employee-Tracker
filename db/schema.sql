/*DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP DATABASE IF EXISTS employees;
*/
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    /*FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE CASCADE*/
); 


