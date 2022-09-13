//Dependancies
const mysql = require('mysql2');
const inquirer = require("inquirer");
require("console.table");

//My SQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_db'
});

connection.connect(err => console.log(err));

//Main menu

function startPrompt() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'userChoice',
      message: 'What would you like to do?',
      choices: [
        'View all Departments',
        'View all Roles',
        'View all Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'View Department Budgets',
        'Update Employee Manager',
        'Exit'
      ]
    }]).then((res) => {
      console.log(res.userChoice);
      switch (res.userChoice) {
        case 'View all Departments':
          viewAllDep();
          break;
        case 'View all Roles':
          viewAllRoles();
          break;
        case 'View all Employees':
          viewAllEmp();
          break;
        case 'Add Department':
          addDep();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee':
          addEmp();
          break;
        case 'Update Employee Role':
          updateEmp();
          break;
        case 'Update Employee Manager':
          updateManager();
          break;
        case 'View Department Budgets':
          pickDep();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    })
};



//View Departments
//department names and department ids

function viewAllDep() {
  connection.query(`SELECT id, name FROM department`, (err, data) => {
    if (err) throw err;
    console.table(data),
      startPrompt();
  })
}

//View Roles
//job title, role id, department, salary 


function viewAllRoles() {

  let query = `SELECT 
role.id, 
role.title, 
role.salary, 
department.name AS department
FROM role
JOIN department 
ON department.id = role.department_id`

  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data),
      startPrompt();
  })
}

//View all Employees
//employee ids, first names, last names, job titles, departments, salaries, and managers

function viewAllEmp() {

  let query = `SELECT 
  employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.name AS department, 
  role.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role
  ON employee.role_id = role.id
LEFT JOIN department
  ON department.id = role.department_id
LEFT JOIN employee manager
  ON manager.id = employee.manager_id`

  connection.query(query, (err, data) => {
    if (err) throw err;

    console.table(data),

      startPrompt();
  })
}


//Add department

function addDep() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Add Department:"
      }
    ]).then((data) => {
      connection.query(`INSERT INTO department SET ?`, { name: data.name }, (err, data) => {
        if (err) throw err;
        console.table(data),
          startPrompt();
      })
    })
};

//Add role
// name, salary, and department for the role

function addRole() {

  connection.query(`SELECT id, name FROM department`, (err, data) => {
    if (err) throw err;
    const department = data.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`

    }));

    addRoleNew(department);
  })
};

function addRoleNew(department) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Role name?"
      },
      {
        type: "input",
        name: "salary",
        message: "Salary for Role? "
      },
      {
        type: "list",
        name: "department",
        message: "Department: ",
        choices: department
      },
    ]).then((data) => {
      connection.query(`INSERT INTO role SET ?`, {
        title: data.title,
        salary: data.salary,
        department_id: data.department
      }, (err, data) => {
        if (err) throw err;
        console.table(data),
          startPrompt();
      })
    })
};

//Add Employee
// employee’s first name, last name, role, and manager

function addEmp() {
  connection.query(`SELECT id, title FROM role`, (err, data) => {
    if (err) throw err;
    const role = data.map(({ id, title }) => ({
      value: id,
      name: `${title}`,

    }));

    connection.query(`SELECT id, first_name FROM employee`, (err, data) => {
      if (err) throw err;
      const manager = data.map(({ first_name, id }) => ({
        name: `${first_name}`,
        value: id,

      }));

      addEmpNew(role, manager);
    });

    function addEmpNew(role, manager) {
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Employee's first name?"
          },
          {
            type: "input",
            name: "last_name",
            message: "Employee's last name? "
          },
          {
            type: "list",
            name: "title",
            message: "Employee's Role?",
            choices: role
          },
          {
            type: "list",
            name: "manager",
            message: "Employee's Manager?",
            choices: manager
          },
        ]).then((data) => {
          connection.query(`INSERT INTO employee SET ?`, { role_id: data.title, first_name: data.first_name, last_name: data.last_name, manager_id: data.manager }, (err, data) => {
            if (err) throw err;
            console.table(data),
              startPrompt();
          })
        })
    }
  })
};

//Update Employee
//prompted to select an employee to update and their new role

function updateEmp() {

  connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, (err, data) => {
    if (err) throw err;
    const employee = data.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }));
    console.table(data);
    updateRole(employee);
  });
}

function updateRole(employee) {

  connection.query(`SELECT role.id, role.title, role.salary FROM role`, (err, data) => {
    if (err) throw err;
    let rolePick = data.map(({ id, title }) => ({
      value: id,
      name: `${title}`
    }));
    console.table(data);
    getUpdatedRole(employee, rolePick);
  });
}

function getUpdatedRole(employee, rolePick) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: `Choose Employee:`,
        choices: employee
      },
      {
        type: "list",
        name: "role",
        message: "Select New Role: ",
        choices: rolePick
      },

    ]).then((data) => {
      connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [data.role, data.employee], (err, data) => {
        if (err) throw err;
        startPrompt();
      });
    });
}

//Bonus--->

//Update employee managers

function updateManager() {

  connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, (err, data) => {
    if (err) throw err;
    const employee = data.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }));
    console.table(data);
    updateManagerNew(employee);
  });
}

function updateManagerNew(employee) {

  connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, (err, data) => {
    if (err) throw err;
    const managerPick = data.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }));
    // console.table(data);
    getUpdatedManager(employee, managerPick);
  });
}

function getUpdatedManager(employee, managerPick) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: `Choose Employee:`,
        choices: employee
      },
      {
        type: "list",
        name: "manager_id",
        message: "Select New Manager: ",
        choices: managerPick
      },

    ]).then((data) => {
      connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [data.manager_id, data.employee], (err, data) => {
        if (err) throw err;
        startPrompt();
      });
    });
}


//View employees by manager

//View employees by department

//Delete departments, roles, and employees


//View the total utilized budget of a department
function pickDep() {

  connection.query(`SELECT id, name FROM department`, (err, data) => {
    if (err) throw err;
    const department = data.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`
    }));

    viewDepBudget(department);
  })
};


function viewDepBudget(department) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "View Department Budget: ",
        choices: department
      },
    ]).then((data) => {


      let query = `SELECT 
 SUM(role.salary), 
 department.id, 
 department.name AS department
 FROM role
 JOIN department 
 ON department.id = role.department_id
 WHERE department.id = ?
 `


      connection.query(query, [data.department], (err, data) => {
        if (err) throw err;
        console.table(data),

          startPrompt();


      })
    })
};

startPrompt();