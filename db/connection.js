const mysql = require('mysql2');

const db = mysql.createConnection(
  {
      host: 'localhost',
      port: 3306,
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Raisin13.sql!',
      database: 'employee_manager',

},
    console.log('Connected to the employee_manager database.')
);
  module.exports = db;