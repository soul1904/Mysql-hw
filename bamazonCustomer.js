var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Netflix_123",
    database: "products_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});


// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
            name: "startPage",
            type: "list",
            message: "CLICK BEGIN TO ENTER",
            choices: ["BEGIN", "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the BEGIN functions
            if (answer.startPage === "BEGIN") {
                beginQ();
            
                connection.end();
            }
        });
}


function beginQ() {

    // const startingQuestions = 
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "What is the ID of the product you would like to buy?\n",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return "Please enter numbers only.";
                }
            }, {
                name: "quantity",
                type: "input",
                message: "How many units of the product would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return "Please enter numbers only.";
                }
            }]).then(function (answer) {
                //connect to the mySQL database and run this query below (shows info of product data based on user input)
                connection.query("SELECT product_name, price, stock_quantity from products WHERE item_id = ?", [answer.productName], function (err, res) {
                    if (err) throw err;
                    //Check to see if we have enough qty.
                    var newQuantity = res[0].stock_quantity - answer.quantity;
                    var totalCost = res[0].price * answer.quantity;
                    if (parseInt(res[0].stock_quantity) > answer.quantity) {
                        //Update the database with the new quantity
                        connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, answer.productName], function (err, res) {
                            if (err) throw err;
                        });
                        //Sends the user  message confirming the order when sufficient qty. in stock
                        console.log('\nSucess, your order has been processed! \nWe had enough stock and you have purchased ' + answer.quantity + " orders of " + res[0].product_name + ' for $ ' + res[0].price + " each. Your total is $" + totalCost + "\n\nBamazon Quadcopter Drones are on their way flying your order to you now. Keep your Windows open!");
                        //Notify user that we don't have their deisred qty.
                    } else if (newQuantity === 0 || newQuantity < res[0].stock_quantity) {
                        console.log("Gosh sorry, we don't have enough stock to fulfill your order.");
                    }
                });
            });

    const startingQuestions =
        // function replace() {

        connection.query(
            "INSERT INTO auctions SET ?",
            {
                product_name: answer.productName,
                stock_quantity: answer.quantity || 0,
            },
            function (err) {
                if (err) throw err;
                console.log("Your auction was created successfully!");
                // re-prompt the user for if they want to bid or post
                beginQ();
            }
        );


    connection.query("SELECT * from products", (err, allProducts) => {
        if (err) throw err;

        allProducts.forEach(product => {
            console.log(
                `Item_id: ${product.item_id}  Product Name: ${product.product_name}            Department: ${product.department_name}      Price:${product.price}        Stock Quantity: ${product.stock_quantity}`.replace(/[\n\r]+/g, '')
            );
        })
    })
}