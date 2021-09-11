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
//not quite sure about this query
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
///////////////////////////////////////////////////////////////////////
//creds to cmelby for the idea for seperate functions to select a role an manager for new employee

//function to show user all role options in inquirer prompt
const rolesArr = [];
function displayRoles() {
  db.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    }
  })
  return rolesArr;
};

//function to show user manager options in inquirer prompt
var managersArr = [];
function displayManagers() {
  //if manager_id === null theyre a manager
  db.query("SELECT first_name, last_name FROM employees WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }
  })
  return managersArr;
};

//function to add an employee
function addEmployee() { 
  inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter employee's first name: "
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter employee's last name: "
      },
      {
        name: "role",
        type: "list",
        message: "Enter employee's role:  ",
        choices: displayRoles()
      },
      {
        name: "choice",
        type: "list",
        message: "Select employee's manager: ",
        choices: displayManagers()
      }
  ])
  .then(function (values) {
    //+1 bc otherwise youll not be able to add to child table
    var chosenRole = displayRoles().indexOf(values.role) +1;
    var chosenManager = displayManagers().indexOf(values.choice) + 1;
    console.log(values.first_name);
    console.log(values.lastName);
    //? == user selection
    db.query("INSERT INTO employees SET ?", 
    {
        first_name: values.first_name,
        last_name: values.last_name,
        manager_id: chosenManager,
        role_id: chosenRole
        
    }, 
    function(err){
        if (err) throw err
        console.table(values)
        promptUser();
    })
})
};
