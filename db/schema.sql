CREATE TABLE department (
    id INTEGER PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INTEGER PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

/*id whats goin on w this manager fk yet*/
CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_manager FOREIGN KEY (role.title_id) REFERENCES roles(title) DEFAULT  
);


