"use strict";

var mysql = require('./db.js');

var Student = function (email_address, name){
    this.email_address = email_address;
    this.name = name;
};

Student.createStudent = function (student, result){
    mysql.query("INSERT INTO tb_student (email_address, name) VALUES (?, ?)", [student.email_address, student.name], function (error, response){
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

module.exports = Student;