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
function addEmployee(){
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter employee first name: ';
      validate: addf
    }
  ])
};

