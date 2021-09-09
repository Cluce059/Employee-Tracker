INSERT INTO departments (name)
VALUES
('Sales'), ('Customer Service'), ('Legal'), ('Engineering');

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Rep', 25.40, 1), ('Receptionist', 20.00, 2), ('Team Council', 75.50, 3), ('Engineer', 50.00, 1);

/*manager id references the employee id of a manager ie a role_id of 4 so carol u r manager today! underlings will have a manager_id of 2 in this case*/
/*no manager id for bossman bc he has no manager*/
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
('Joe', 'Shmoe', 1, 3),
 ('Jay', 'Say', 1, 3), 
 ('Peyton', 'Manning', 4, null), 
 ('Jody', 'Beehive', 2, 5), 
 ('Larry', 'Legal', 3, null);

