const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');
const db = require('./db/connection');

//const Connection = require('mysql2/typings/mysql/lib/Connection');

db.connect(err => {
  if(err) throw err;
  promptUser();
});

//havent figure out the why to this  yet but the prompt only works if options are predefiuned here
const options = {
  viewAllEmployees: 'View all employees',
  viewEmployeesByManager: 'View employees by Manger',
  viewEmployeesByDepartment: 'View employees by department',
  addEmployee: 'Add employee',
  removeEmployee: 'Remove employee',
  updateEmployeeRole: 'Update employee role',
  updateEmployeeManager: 'Update employee manager'
};

//inquirer prompt for menu options
function promptUser (){
  inquirer.prompt({
    name: 'menu',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      options.viewAllEmployees,
      options.viewEmployeesByManager,
      options.viewEmployeesByDepartment,
      options.addEmployee,
      options.removeEmployee,
      options.updateEmployeeRole,
      options.updateEmployeeManager
    ]
})
.then(choice => {
  console.log(choice);
  switch(choice.menu){
    case options.viewAllEmployees:
      viewAllEmployees();
      break;
    case options.viewEmployeesByManager:
      viewEmployeesByManager();
      break;
    case options.viewEmployeesByDepartment:
      viewEmployeesByDepartment();
      break;
    case options.addEmployee:
      addEmployee();
      break;
  }

  /*
  
  switch(choice){
    case 'View all employees':
      viewAllEmployees();
      break;
      
    case 'View all employees by manager':
      viewEmployeesByManager();
      break;
    case  'View all employees by department':
      viewEmployeesByDepartment();
      break;
    case 'Add employee':
      addEmployee();
      break;
    case 'Remove employee':
      removeEmployee();
      break;
    case 'Update employee role':
      updateEmployeeRole();
      break;
    case 'Update employee manager':
      updateEmployeeManager();
      break;
      
  }
  */
  });
};

//function to view all employeesf
function viewAllEmployees() {
  const query = `SELECT employees.id, employees.first_name, 
  employees.last_name, roles.title, departments.name AS department, 
  roles.salary FROM employees, roles, departments WHERE departments.id = roles.department_id  
  AND roles.id = employees.role_id 
  ORDER BY employees.id ASC`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW ALL EMPLOYEES');
    console.log('\n');
    console.table(res);
    promptUser();
});
};

//function to view employees by manager name
//not quit sure about this query
function viewEmployeesByManager(){
  const query  = `SELECT employees.first_name, 
  employees.last_name, 

  employees.first_name AS manager WHERE employees.manager_id = NULL,

  FROM employees LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id`;
  db.query(query, (err, res) => {
    if(err) throw err;
    console.table(res);
    promptUser();
  });
};

//
function viewEmployeesByDepartment(){
  const query  = `SELECT employees.first_name, 
  employees.last_name, 
  departments.name AS department
  FROM employees LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id`;
  db.query(query, (err, res) => {
    if(err) throw err;
    console.table(res);
    promptUser();
  });
};

//function to add an employee
function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter employee first name: ',
      validate: addFirstName =>{
        if(addFirstName){
          return true;
        } else {
          console.group('Please enter employee first name: ');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter employee last name: ',
      validate: addLastName =>{
        if(addLastName){
          return true;
        } else {
          console.log('Please enter employee last name');
          return false;
        }
      }
    }
  ])
    .then(function(answer) {
      //console.log(answer.last_name);
      const newEmp = [answer.first_name, answer.last_name];
      const roleQuery = `SELECT roles.id, roles.title FROM roles`;
      //console.log(roleQuery);
      db.promise().query(roleQuery, (error, res) => {
        if(error) throw (error);
        const roleOptions = res.map(({ id, title }) => ({ name: title, value: id}));
        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: 'Choose employee role: ',
            choices: roleOptions
          }
        ])
        .then(chosenRole =>{
          //.roles? if err?
          const newEmpRole = chosenRole.roles;
          newEmp.push(newEmpRole);
          const managerQuery = `SELECT * FROM employees`;
          db.promise().query(managerQuery, (err, res) =>{
            if(err) throw err;
            const managerOptions = data.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, valude: id }));
            inquirer.prompt([
              {
                type: 'list',
                name: 'manager',
                messsage: 'Choose a manager for the new employee: ',
                choices: managerOptions
              }
            ])
            .then(chosenManager =>{
              const manager = chosenManager.manager;
              newEmp.push(manager);
              const newEmpSQL = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`;
              db.query(newEmpSQL, newEmp, (err) => {
                if(err) throw err;
                console.log('Employee Added.')
                viewAllEmployees();
              });
            });
          });
        });
      });
    });
};

