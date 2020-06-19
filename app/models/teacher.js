"use strict";

var mysql = require('./db.js');

var Teacher = function (email_address, name){
    this.email_address = email_address;
    this.name = name;
};

Teacher.createTeacher = function (teacher, result){
    mysql.query("INSERT INTO tb_teacher (email_address, name) VALUES (?, ?)", [teacher.email_address, teacher.name], function (error, response){
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

module.exports = Teacher;