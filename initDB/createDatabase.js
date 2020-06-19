"use strict";

var mysql = require('mysql');
const dbConfig = require("../config/db.config.js");

// Create a connection to MySQL
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD
});

// Open MySQL connection
connection.connect(function(error) {
    if (error) throw error;
    console.log("MySQL connected!");
  
    // Create new database
    connection.query("CREATE DATABASE " + dbConfig.DATABASE, function (err, result) {
        if (error) throw error;
        console.log("Database \"school\" created successfully!");
        process.exit();
    });
});