"use strict";

var mysql = require('mysql');
const dbConfig = require("../config/db.config.js");

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

    // Create required tables
    var sql1 = "CREATE TABLE IF NOT EXISTS tb_teacher (" + 
                "email_address VARCHAR(255) NOT NULL," +
                "name VARCHAR(255)," + 
                "PRIMARY KEY (email_address))";

    var sql2 = "CREATE TABLE IF NOT EXISTS tb_student (" + 
                "email_address VARCHAR(255) NOT NULL," +
                "name VARCHAR(255)," + 
                "is_suspended INT NOT NULL DEFAULT 0," + 
                "PRIMARY KEY (email_address))";

    var sql3 = "CREATE TABLE IF NOT EXISTS tb_registration (" + 
                "teacher_email_address VARCHAR(255) NOT NULL," +
                "student_email_address VARCHAR(255) NOT NULL," + 
                "creation_time DATETIME DEFAULT CURRENT_TIMESTAMP," + 
                "FOREIGN KEY (teacher_email_address) REFERENCES tb_teacher (email_address)," + 
                "FOREIGN KEY (student_email_address) REFERENCES tb_student (email_address))";

    connection.query(sql1, function(error, result) {
        if (error) throw error;
        console.log("tb_teacher created!");
        connection.query(sql2, function(error, result) {
            if (error) throw error;
            console.log("tb_student created!");
            connection.query(sql3, function(error, result) {
                if (error) throw error;
                console.log("tb_registration created!");
                process.exit();
            });
        });
    });
});