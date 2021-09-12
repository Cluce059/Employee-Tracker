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
  //^ if you can figure out thr logic then goi for it but rn im tired so no bonuses for tonight
  updateEmployeeRole: 'Update employee role',
  viewAllRoles: 'View all roles',
  addRole: 'Add role',
  removeRole: 'Remove role'
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
      options.viewAllRoles,
      options.addRole,
      options.removeRole
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
    case options.removeEmployee:
       removeEmployee();
       break;
    case options.updateEmployeeRole:
      updateEmployeeRole();
      break;
    //case options.updateEmployeeManager:
      // updateEmployeeManager();
    //   break;
    case options.viewAllRoles:
      viewRoles();
      break;
    case options.addRole:
      addRole();
      break;
    case options.removeRole:
      removeRole();
      break;
  }
  });
};

//function to view all employees
function viewAllEmployees() {
  const query = `SELECT employees.id, employees.first_name, 
  employees.last_name, roles.title, departments.name AS department, 
  roles.salary FROM employees, roles, departments WHERE departments.id = roles.department_id  
  AND roles.id = employees.role_id 
  ORDER BY employees.id ASC`;
  db.query(query, (err, res) => {
    if (err) throw err;
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
///////////////////////////////utility functions////////////////////////////////////////

//function to show user all role options in inquirer prompt
const rolesArr = [];
function displayRoles() {
  db.query(`SELECT * FROM roles`, function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    }
  })
  return rolesArr;
};

//function to show user manager options in inquirer prompt
const managersArr = [];
function displayManagers() {
  //if manager_id === null theyre a manager
  db.query(`SELECT first_name, last_name FROM employees WHERE manager_id IS NULL`, function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }
  })
  return managersArr;
};

function displayEmployees() {
  let employeesArr = [];
  //if manager_id === null theyre a manager
  db.query(`SELECT first_name, last_name FROM employees `, function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      employeesArr.push(res[i].first_name);
    }
  })
  //console.log(employeesArr);
  return employeesArr;
};

function getEmployees() {
  return new Promise((resolve, reject) => {
      db.query(`SELECT id, last_name FROM employees ORDER BY last_name`, (err, data) => {
          if (err) {
              return reject(err);
          }
          return resolve(data);
      });
  });
};

function empId() {
  return ([
      {
          name: 'name',
          type: 'input',
          message: 'Enter employee ID '
      }
  ]);
};

function addNewRole(title, salary, department_id) {
  db.query('INSERT INTO roles SET ?', {
    title, salary, department_id
  }, 
  (err, res) => {
      if (err) throw err;
      promptUser();
  });
};

function getDepartments() {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM departments`, (err, res) => {
          if (err) {
              return reject(err);
          }
          return resolve(res);
      })
  });
};

function getRoles() {
  return new Promise((resolve, reject) => {
      db.query(`SELECT roles.title FROM roles`, (err, res) => {
          if (err) {
              return reject(err);
          }
          return resolve(res);
      })
  });
};

function viewRoles() {
  const query = `SELECT roles.title FROM roles ORDER BY roles.title`;
  db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      promptUser();
  });
};

//////////////////////////////////////////////////////////////////////////////////////////

//function to add an employee
function addEmployee() { 
  inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: "Enter employee's first name:"
      },
      {
        name: 'last_name',
        type: 'input',
        message: "Enter employee's last name: "
      },
      {
        name: 'role',
        type: 'list',
        message: "Enter employee's role:  ",
        choices: displayRoles()
      },
      {
        name: 'choice',
        type: 'list',
        message: "Select employee's manager: ",
        choices: displayManagers()
      }
  ])
  .then(function (values) {
    //+1 bc otherwise youll not be able to add to child table
    let chosenRole = displayRoles().indexOf(values.role) +1;
    let chosenManager = displayManagers().indexOf(values.choice) + 1;
    //console.log(values.first_name);
    //console.log(values.lastName);
    //? == user selection
    db.query(`INSERT INTO employees SET ?`, 
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
});
};

//function to remove employee by id
function removeEmployee() {
  getEmployees()
  .then(res => {
      const employeesData = [];
      const employeesNames = [];
      for (let i = 0; i < res.length; i++) {
          employeesData.push(res[i]);
          employeesNames.push(res[i].last_name)
      }
      removeEmployeePrompt(employeesData, employeesNames);
      //separation of concerns
  })
  //async will require a .catch block, unlike reg promise staments that can just thore the error
  .catch(err => {
      console.log(err);
  })
};
//helper function to remove chosen employee from db
function removeEmployeePrompt(employees, employeesNames) {
  inquirer.prompt([
      {
          type: 'list',
          name: 'name',
          message: 'Which employee to remove? :',
          choices: employeesNames
      },
      {
          type: 'confirm',
          name: 'confirmDelete',
          message: 'Are you sure you want to remove this employee?'
      }
  ]).then(answers => {
      if (answers.confirmDelete){
          let employeeId;
          for (let i = 0; i < employees.length; i++) {
              if (answers.name === employees[i].last_name) {
                
                  employeeId = employees[i].id;
              }
          }
          db.query(`DELETE FROM employees WHERE ?`, {
            //key: value
            id: employeeId
          }, 
          (err, res) => {
              if (err) throw err;
              promptUser();
          });
      } else {
          promptUser();
      }
  });
};


//trying something different asyc function () for update employee role awaits res from db before updating (to verify that empoyee is valid in the first place)
async function updateEmployeeRole(){
  //use utility function section to get employee id for role update
  const employeeId = await inquirer.prompt(empId());

  db.query('SELECT roles.id, roles.title FROM roles ORDER BY roles.id;', async (err, res) => {
      if (err) throw err;
      const { role } = await inquirer.prompt([
          {
              name: 'role',
              type: 'list',
              choices: () => res.map(res => res.title),
              message: 'Choose new employee role: '
          }
      ]);
      let roleId;
      //fore each row fo resulting data
      for (const row of res) {
          if (row.title === role) {
              roleId = row.id;
              continue;
          }
      }
      //user input in template literal
      db.query(`UPDATE employees SET role_id = ${roleId}
      WHERE employees.id = ${employeeId.name}`, async (err, res) => {
          if (err) throw err;
          promptUser();
      });
  });
};

//function that adds new role to roles
function addRole() {
  const dep = [];
  getDepartments()
  .then(data => {
          for (let i = 0; i < data.length; i++) {
            //console.log(data);
            //push the new role to the departments table
              dep.push(data[i])
          }
      })
  .catch(err => {
      console.log(err);
  });

  inquirer.prompt([
      {
          type: 'input',
          name: 'title',
          message: 'Enter new role title: '
      },
      {
          type: 'input',
          name: 'salary',
          message: 'Enter new role salary: ',
      },
      {
          type: 'list',
          name: 'department',
          message: 'Enter new role department: ',
          choices: dep
      }
  ]).then(answers => {
      let departmentId;
      for (let i = 0; i < dep.length; i++) {
        console.log()
          if (answers.department === dep[i].name) {
              departmentId = dep[i].id;
          }
      }
      addNewRole(answers.title, answers.salary, departmentId);
  });
};


function removeRole() {
  getRoles()
  .then(res => {
    console.log(res);
      const rolesData = [];
      const rolesTitles = [];
      for (let i = 0; i < res.length; i++) {
          rolesData.push(res[i]);
          rolesTitles.push(res[i].title)
      }
      removeRolePrompt(rolesData, rolesTitles);
      //separation of concerns
  })
  //async will require a .catch block, unlike reg promise staments that can just thore the error
  .catch(err => {
      console.log(err);
  })
};


//function to remove role
function removeRolePrompt(roles, roleTitles){
  inquirer.prompt([
    //so sick of these stupid bugs. list type prompts do not work unless an input type comes beforehand. 
    {
      name: 'role_title',
      type: 'input',
      message: "Enter role title:"
    },
      {
          type: 'list',
          name: 'role',
          message: 'Which role would you like to remove? ',
          choices: roles
      }
    ])
  .then(answers => {
      let roleTitle;
      for (let i = 0; i < roles.length; i++) {
          if (answers.role === roles[i].title) {
            
              roleTitle = roles[i].title;
          }
      }
      db.query(`DELETE FROM roles WHERE ?`, {
        //key: value
        title: roleTitle
      }, 
      (err, res) => {
          if (err) throw err;
          promptUser();
      });
  
      promptUser();
  
  });
};
