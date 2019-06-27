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

connection.connect(function (err) {
    if (err) throw err;
    console.log("you made something work!");
    connection.end();
    allProducts();
});

function allProducts() {
    // query the database for all items for sale
    connection.query("SELECT * from products;", function (err, results) {
        if (err) throw err;
        else {
            // console log all products
            console.table(results);

        }
        pickProduct();

    }

    )
}

function pickProduct() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "WHAT IS THE ID OF THE PRODUCT YOU ARE LOOKING FOR?"
            },
            {
                name: "quantity",
                type: "input",
                message: "HOW MANY WOULD YOU LIKE ?"
            }
        ])
        .then(function (answer) {


            var product = answer.product;
            var quantity = answer.quantity;

            var queryProducts = "SELECT * FROM products WHERE ?";
            var cost
            connection.query(queryProducts, { item_id: product }, function (err, res) {
                var productInfo = res[0];
                if (err) throw err;
                if (quantity > productInfo.stock_quantity) {
                    console.log("NOT ENOUGH");
                    allProducts()

                }

                else {

                    if (quantity <= productInfo.stock_quantity) {
                        console.log("We have " + quantity + " " + productInfo.product_name + "s in stock for your order!")

                        console.log("Thank you for your order! Please wait while we process your order!");
                    }
                    if (cost = quantity * productInfo.price) {
                        console.log("The total cost of your order is $" + cost );
                    }

                    var queryUpdate = "UPDATE products SET ? WHERE ?"
                    connection.query(queryUpdate, [{ stock_quantity: answer.quantity }, { item_id: product }], function (err, res) {
                        if (err) throw err;
                        else {
                            console.log("Inventory has been updated!");

                            inquirer
                                .prompt({
                                    name: 'next',
                                    type: "input",
                                    message: 'Would you like to place another order (Yes/No)?',
                                })
                                .then(function (answer) {
                                    if (answer.next === "Yes") {
                                        allProducts();
                                    } else {
                                        connection.end()
                                        console.log("Thank you for shopping with us! Come back soon!")
                                    }

                                });


                        }
                    })
                }


            })

        })


}