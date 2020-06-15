var mysql = require('mysql');
const dbConfig = require("./config/db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD
});

// Open MySQL connection
connection.connect(function(error) {
  if (error) throw error;
  console.log("MySQL connected!");
  
  connection.query("CREATE DATABASE school", function (err, result) {
    if (error) throw error;
    console.log("Database \"school\" created successfully!");
  });
});

module.exports = connection;