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
  switch(choice.menu){
    case options.viewAllEmployees:
      viewAllEmployees();
      break;
  }

  /*
  console.log('choice',choice);
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
  roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees
  LEFT JOIN employees manager on manager.id = employees.manager_id
  INNER JOIN roles ON (roles.id = employees.role_id)
  INNER JOIN departments ON (departments.id = roles.department_id)
  ORDER BY employees.id;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW ALL EMPLOYEES');
    console.log('\n');
    console.table(res);
    promptUser();
});
};



