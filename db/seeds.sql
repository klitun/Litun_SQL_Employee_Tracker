USE employee_db;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Inventory"),
       ("Customer Service"),
       ("Visual");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 40000, 1),
("Salesperson", 25000, 1),
("Stockroom Manager", 45000, 2),
("Stockroom Assistant", 20000, 2), 
("CS Lead", 40000, 3), 
("CS Teammember", 30000, 3),
("Visual Manager", 45000, 4); 



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mani", "Verma", 1, null),
("Daniel", "Smith", 2, 1),
("Zena", "Lee", 2, 1),
("Antony", "B", 3, null), 
("JJ", "Leo", 4, 4),
("Rob", "Robenson", 4, 4),
("Matt", "Matthews", 5, null), 
("Jane", "Doe", 6, 7),
("Shannon", "Angelo", 6, 7),
("Lisette", "Rodriguez", 7, null); 

