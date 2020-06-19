"use strict";

var mysql = require('./db.js');

var Student = function(email_address, name) {
    this.email_address = email_address;
    this.name = name;
};

Student.createStudent = function(student, result) {
    mysql.query("INSERT INTO tb_student (email_address, name) VALUES (?, ?)", [student.email_address, student.name], function(error, response){
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

Student.getStudentByEmailAddress = function(student_email_address, result) {
    mysql.query("SELECT * FROM tb_student WHERE email_address = ?", student_email_address, function(error, response) {
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

Student.suspendStudent = function(student_email_address, result) {
    mysql.query("UPDATE tb_student SET is_suspended = 1 WHERE email_address = ?", student_email_address, function(error, response) {
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

module.exports = Student;