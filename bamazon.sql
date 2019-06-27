CREATE DATABASE products_db;

USE products_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price VARCHAR(45) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("milk", "dairy", 11, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("chips", "snacks", 5, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("bread", "bakary", 4, 40);

SELECT * FROM products