// Import and require mysql2
const mysql = require('mysql2');
// Enable access .env variables
require('dotenv').config();
// Import cTable to display tables
const cTable = require('console.table');
// Import inquirer to prompt user for actions
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
);

function runProgram() {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
        },
        {
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            name: 'addDepartment',
            when: function(data) {
                return data.action === 'Add Department';
            }
        }
    ])
    .then((data) => {
        if (data.action === 'Quit') {
            console.log("Goodbye!");
            process.exit(0);
        } else if (data.action === 'View All Departments') {
            // Query department
            db.query('SELECT * FROM department', function (err, results) {
                console.table(results);
                runProgram();
            });
        } else if (data.action === 'View All Roles') {
            // Query role
            db.query('SELECT * FROM role', function (err, results) {
                console.table(results);
                runProgram();
            });
        } else if (data.action === 'View All Employees') {
            // Query employee
            db.query('SELECT * FROM employee', function (err, results) {
                console.table(results);
                runProgram();
            });
        } else if (data.action === 'Add Department') {
            db.query('INSERT INTO department (name) VALUES (?)', data.addDepartment, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Added ${data.addDepartment} to the database.`);
                }
                runProgram();
            });
            
        }
    })
    .catch((error) => {
        console.error(error);
      });
}

runProgram();