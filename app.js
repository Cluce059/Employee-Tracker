const express = require('express');
const cTable = require('console.table');
const db = require('./db/connection');
const inquirer = require('inquirer');
//const Connection = require('mysql2/typings/mysql/lib/Connection');

db.connect((error) => {
  if(error) throw error;
  console.log(`
  ===============================
  UR IN 
  ======================================`);
});

//inquirer prompt for menu options
function promptUser(){
  inquirer.prompt({
    name: 'menu',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all employees',
      'View all employees by manager',
      'View all employees by department',
      'Add employee',
      'Remove employee',
      'Update employee role',
      'Update employee manager'
    ]
})
  .then(function(choice){
    //const {ans} = choice;
    if(choice === 'View all employees'){
        //function to display all employees
        viewAllemployees();
    }
    if(choice === 'View all employees by manager'){
      viewEmployeesByManager();
    }
    if(choice === 'View all employees by department'){
      viewAllEmployeesByDepartment();
    }
    if(choice === 'Add employee'){
      addEmployee();
    }
    if(choice === 'Remove Employee'){
      removeEmployee();
    }
    if(choice === 'Update employee manager'){
      updateEmployeeManager();
    }
    if(choice === 'Update employee role'){
      updateEmployeeRole();
    }
  })
}

promptUser();