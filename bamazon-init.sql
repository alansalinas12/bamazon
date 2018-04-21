DROP SCHEMA IF EXISTS bamazon;

CREATE SCHEMA `bamazon`;
USE bamazon;

CREATE TABLE `products` (
`item_id` INTEGER(10) UNSIGNED AUTO_INCREMENT NOT NULL,
`product_name` VARCHAR(255) NOT NULL,
`department_name` VARCHAR(255) NOT NULL,
`price` DECIMAL(10,2) NOT NULL,
`stock_quantity` INTEGER(10) UNSIGNED NOT NULL,

PRIMARY KEY(item_id)

);
