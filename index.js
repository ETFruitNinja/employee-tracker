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

// function to produce a list of managers (with each manager's id)
function listManagers() {
    return new Promise((resolve, reject) => {
      const managers = [{ id: null, name: "None" }];
  
      db.query(`SELECT * FROM employee WHERE manager_id IS ?`, [null], (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          for (let i = 0; i < result.length; i++) {
            managers.push({
              id: result[i].id,
              name: `${result[i].first_name} ${result[i].last_name}`
            });
          }
          resolve(managers);
        }
      });
    });
}

// function to produce a list of employees
function listEmployees() {
    return new Promise((resolve, reject) => {
      const employees = [];
  
      db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          for (let i = 0; i < result.length; i++) {
            employees.push({
                id: result[i].id,
                name: `${result[i].first_name} ${result[i].last_name}`
            });
          }
          resolve(employees);
        }
      });
    });
}

// function to find the id based on the name
function findIdByName(listOfNames, employeeName) {
    for (const entry of listOfNames) {
        if (entry.name === employeeName) {
            return entry.id;
      }
    }
    return null; // If the employee with the specified name is not found
}

async function runProgram() {
    try {
      const listOfManagers = await listManagers();
      const listOfEmployees = await listEmployees();

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
            // if user wants to add EMPLOYEE to db, prompts user for FIRST NAME of employee
            {
                type: 'input',
                message: 'What is the first name of the employee you would like to add?',
                name: 'firstName',
                when: function(data) {
                    return data.action === 'Add Employee';
                }
            },
            // if user wants to add EMPLOYEE to db, prompts user for LAST NAME of employee
            {
                type: 'input',
                message: 'What is the last name of the employee you would like to add?',
                name: 'lastName',
                when: function(data) {
                    return data.action === 'Add Employee';
                }
            },
            // if user wants to add EMPLOYEE to db, prompts user for ROLE the employee belongs to
            {
                type: 'input',
                message: 'What is the role of the new employee?',
                name: 'employeeRole',
                when: function(data) {
                    return data.action === 'Add Employee';
                }
            },
            // if user wants to add EMPLOYEE to db, prompts user for the name of the employee's MANAGER
            {
                type: 'list',
                message: 'Who is this employee\'s manager?',
                name: 'manager',
                when: function(data) {
                    return data.action === 'Add Employee';
                },
                choices: listOfManagers.map(entry => entry.name)
            },
            // if user wants to edit employee role, prompts user for the NAME of the employee
            {
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                name: 'roleChangeName',
                when: function(data) {
                    return data.action === 'Update Employee Role';
                },
                // TODO: make list of employees function
                choices: listOfEmployees.map(entry => entry.name)
            },
            // if user wants to edit employee role, prompts user for the NEW ROLE of the employee
            {
                type: 'input',
                message: 'Select the new role for this employee',
                name: 'newRole',
                when: function(data) {
                    return data.action === 'Update Employee Role';
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
                // retrieve role id based on role name entered by user
                db.query('SELECT id FROM role WHERE title = ?', [data.employeeRole], (err, roleIdResult) => {
                    if (err) {
                        console.log(err);
                    }
                    // adds role title, salary, and department to database
                    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.firstName, data.lastName, roleIdResult[0].id, findIdByName(listOfManagers, data.manager)], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`Added ${data.firstName} ${data.lastName} to the database.`);
                        }
                        runProgram();
                    });
                })
            } else if (data.action === 'Update Employee Role') {
                // retrieve role id based on role name entered by user
                db.query('SELECT id FROM role WHERE title = ?', [data.newRole], (err, roleIdResult) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // changes value of employee's role to match the new role
                        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleIdResult[0].id, findIdByName(listOfEmployees, data.roleChangeName)], (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(`Updated role for ${data.roleChangeName}.`);
                            }
                            runProgram();
                        });
                    }
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
    } catch (err) {
      console.error(error); // Handle error
    }
}

runProgram();