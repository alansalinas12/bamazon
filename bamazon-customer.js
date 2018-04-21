function bamazonCustomer() {

    require("dotenv").config();
    
    let mysql = require("mysql");
    let inquirer = require("inquirer");

    let menu = require("./index.js");

    let connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: process.env.MYSQLPASSWORD,
        database: "bamazon"
    });

    connection.connect(function() {
        customerMenu();
    });

    function customerMenu() {
        inquirer.prompt([
            {
                type: "rawlist",
                name: "functions",
                message: "What is your choice?",
                choices: [
                    "Products for sale",
                    "Make a purchase",
                    "Main menu",
                    "Exit"
                ]
            }
        ]).then(function (userChoice) {
            switch (userChoice.functions) {
                case "Products for sale":
                displayItems();
                break;

                case "Make a purchase":
                purchaseItem();
                break;

                case "Main menu":
                connection.end();
                menu.bamazonMenu();
                break;

                case "Exit":
                exitMenu();
                break;
            }
        });
    }

    function displayItems() {

        connection.query("SELECT * FROM products", function (err, res) {

            let data = [];
            let productInfo = [];
            for (let i = 0; i < res.length; i++) {
                productInfo = [res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity];
                data.push(productInfo);
            }

            console.log(data);

            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.once('data', function () {
                customerMenu();
                process.exit.bind(process, 0);
            });
        });
    }

    function purchaseItem() {
        inquirer.prompt([
            {
                name: "productID",
                message: "Enter product ID.",
                validate: answer => {
                    let pass = answer.match(/^([1-9]|10)$/);

                    if (pass) {
                        return true;
                    }
                    return "Enter number larger than 0.";
                }
            },
            {
                name: "quantity",
                message: "Enter purchase amount.",
                validate: answer => {
                    let pass = answer.match(/^([1-9]|10)$/);

                    if (pass) {
                        return true;
                    }
                    return "Enter number larger than 0.";
                }
            }
        ]).then(function (input) {
            let query = connection.query("SELECT * FROM products WHERE item_id=?", input.productID, function (err, res) {

                    if (!res) {
                        console.log("\nInvalid ID. Please try again.\n");
                        purchaseItem();

                    } else {

                        if (input.quantity > res[0].stock_quantity) {

                            console.log("Not enough left. Current quantity: " + res[0].stock_quantity);
                            purchaseItem();

                        } else {

                            let totalPrice = (input.quantity * res[0].price).toFixed(2)

                            let query = connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: res[0].stock_quantity - input.quantity
                                    },
                                    {
                                        item_id: input.productID
                                    }
                                ]
                            );

                            let receit = [
                                ["Product", "Price", "Quantity", "Total"],
                                [res[0].product_name, "$" + res[0].price.toFixed(2), input.quantity, "$" + totalPrice]
                            ];

                            console.log("\nReceit:\n");

                            console.log(receit);

                            console.log("\nReturn to the menu");

                            process.stdin.setRawMode(true);
                            process.stdin.resume();
                            process.stdin.once('data', function () {
                                customerMenu();
                                process.exit.bind(process, 0);
                            });
                        }
                    }
                });
            });
    }

    function exitMenu() {
        connection.end();
    }
}

module.exports.bamazonCustomer = bamazonCustomer;