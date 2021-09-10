INSERT INTO departments (name)
VALUES 
('IT'),
('Engineering'),
('Sales'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Developer', 10000, 1),
('Engineer', 12000, 2),
('Accountant', 10000, 3), 
('Council', 25000, 4), 
('Marketer', 8000, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Joe', 'Shmoe', 2, null),
('Dalia', 'Firbank', 1, 1),
('Tom', 'Bom', 4, null),
('Peter', 'Griffin', 3, 3),
('Spider', 'Mann', 4, null),
('Talking Bird', 'Sanchez', 3, 5);
