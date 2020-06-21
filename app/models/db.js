"use strict";

var mysql = require('mysql');
const dbConfig = require("../../config/db.config.js");

// Create connection to the MySQL database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE
});

// Open MySQL connection
connection.connect(function(error) {
    if (error) throw error;
    console.log("MySQL \"" + dbConfig.DATABASE + "\" database connected!");
});

module.exports = connection;