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
        // initial question prompting user for action
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
            // TODO: add delete function
        },
        // if user wants to add DEPARTMENT to db, prompts user for NAME of department
        {
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            name: 'addDepartment',
            when: function(data) {
                return data.action === 'Add Department';
            }
        },
        // if user wants to add ROLE to db, prompts user for NAME of role
        {
            type: 'input',
            message: 'What is the name of the role you would like to add?',
            name: 'addRole',
            when: function(data) {
                return data.action === 'Add Role';
            }
        },
        // if user wants to add ROLE to db, prompts user for SALARY of role
        {
            type: 'input',
            message: 'What is the salary of the role you would like to add?',
            name: 'addSalary',
            when: function(data) {
                return data.action === 'Add Role';
            }
        },
        // if user wants to add ROLE to db, prompts user for DEPARTMENT that role belongs to
        {
            type: 'input',
            message: 'Which department does this new role belong to?',
            name: 'sortRole',
            when: function(data) {
                return data.action === 'Add Role';
            }
        },
        {
            type: 'input',
            message: 'What is the name of the employee you would like to add?',
            name: 'addEmployee',
            when: function(data) {
                return data.action === 'Add Employee';
            }
        },
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
            // adds department to database
            db.query('INSERT INTO department (name) VALUES (?)', data.addDepartment, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Added ${data.addDepartment} to the database.`);
                }
                runProgram();
            });
            
        } else if (data.action === 'Add Role') {
            // retrieve department id based on department name entered by user
            db.query('SELECT id FROM department WHERE name = ?', [data.sortRole], (err, depIdResult) => {
                if (err) {
                    console.log(err);
                }
                // adds role title, salary, and department to database
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.addRole, data.addSalary, depIdResult[0].id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Added ${data.addRole} to the database.`);
                    }
                    runProgram();
                });
            })
        } else if (data.action === 'Add Employee') {
            // retrieve employee id based on department name entered by user
            db.query('SELECT id FROM department WHERE name = ?', [data.sortRole], (err, depIdResult) => {
                if (err) {
                    console.log(err);
                }
                // adds role title, salary, and department to database
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.addRole, data.addSalary, depIdResult[0].id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Added ${data.addRole} to the database.`);
                    }
                    runProgram();
                });
            })
        }
    })
    .catch((error) => {
        console.error(error);
      });
}

runProgram();