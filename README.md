# 12 SQL: Employee Tracker

## Description

Built a command line application using Inquirer and SQL, learning how to utilize both programs together to handle user prompts to a database.
Used console.table package to print data tables to console terminal.

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Screenshot

![Screenshot of app.](./Assets/screenshot.png)

## Installation and Usage

Run npm i to install dependancies.
Set up the database in db with my sql -u root -p then,
SOURCE schema.sql then,
SOURCe seeds to fill db.
Run node server to start.


## Video Link

Video on Google Drive