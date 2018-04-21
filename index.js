let inquirer = require("inquirer");
let Customer = require("./bamazon-customer.js");
let Manager = require("./bamazon-manager.js");

function bamazonMenu() {

    console.log("\nBamazon Main Menu\n");

    inquirer.prompt([
        {
            type: "rawlist",
            name: "functions",
            message: "What are you?",
            choices: [
                "Customer",
                "Manager",
                "Exit"
            ]
        }
    ]).then(function (userChoice) {

        switch (userChoice.functions) {
            case "Customer":
                Customer.bamazonCustomer();
                break;

            case "Manager":
                Manager.bamazonManager();
                break;
                
            case "Exit":
                console.log("\033c");
                return;
                break;
        }
    });
}

bamazonMenu();

module.exports.bamazonMenu = bamazonMenu;