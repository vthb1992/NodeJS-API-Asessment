"use strict";

var mysql = require('./db.js');

var Registration = function(teacher_email_address, student_email_address) {
    this.teacher_email_address = teacher_email_address;
    this.student_email_address = student_email_address;
};

Registration.createRegistration = function(registration, result) {
    mysql.query("INSERT INTO tb_registration (teacher_email_address, student_email_address) VALUES (?, ?)", [registration.teacher_email_address, registration.student_email_address], function(error, response){
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

Registration.deleteRegistration = function(registration, result) {
    mysql.query("DELETE FROM tb_registration WHERE teacher_email_address = ? AND student_email_address = ?", [registration.teacher_email_address, registration.student_email_address], function(error, response){
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

Registration.getRegistrationByEmailAddresses = function(registration, result) {
    mysql.query("SELECT * FROM tb_registration WHERE teacher_email_address = ? AND student_email_address = ?", [registration.teacher_email_address, registration.student_email_address], function(error, response) {
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

Registration.getRegistrationByTeacherEmailAddress = function(teacher_email_address, result) {
    mysql.query("SELECT * FROM tb_registration WHERE teacher_email_address = ?", teacher_email_address, function(error, response) {
        if (error) {
            result(error, null);
        } else {
            result(null, response);
        }
    });
};

module.exports = Registration;