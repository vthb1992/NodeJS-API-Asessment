"use strict";

var Teacher = require('../models/teacher.js');
var Student = require('../models/student.js');
var emailValidator = require("email-validator");
var Promise = require('promise');
const Registration = require('../models/registration.js');

exports.register = function (request, response) {
    var teacher = request.body.teacher;
    var students = request.body.students;

    if (teacher == undefined || students == undefined) {
        response.status(400).send({ message: 'Please provide the email addresses for both the teacher and students for registration.' });
    } else if (!Array.isArray(students) || Array.isArray(teacher)) {
        response.status(400).send({ message: 'Please provide a teacher\'s email address and an array of students\' email addresses for registration, following the supported JSON Request Body format.' });
    } else if (students.length < 1 || teacher.length < 1) {
        response.status(400).send({ message: 'Please provide a teacher\'s email address and at least one student(s)\' email addresses for registration.' });
    } else if (!emailValidator.validate(teacher) || !validateListOfEmails(students)) {
        response.status(400).send({ message: 'At least one of the email addresses are invalid.' });
    } else {
        let createPromises = [];

        createPromises.push(createTeacher(teacher));
        createPromises.push(createStudents(students));

        Promise.all(createPromises)
        .then(() => {
            console.log("Teacher and Student records are created successfully if they do not exist yet.");
            
            let registrationPromises = [];
            
            for (var i = 0; i < students.length; i++) {
                registrationPromises.push(createRegistration(teacher, students[i]));
            }

            Promise.all(registrationPromises)
            .then(() => {
                console.log("Teacher to Students registrations are created successfully if they do not exist yet.");
                response.status(204).end();
            }).catch((error) => {
                response.status(500).send({ message: 'Internal Server Error' });
            })    
        }).catch((error) => {
            console.log(error);
            response.status(500).send({ message: 'Internal Server Error' });
        });
    }
};

var createTeacher = function (teacher) {
    return new Promise(function (resolve, reject){
        var newTeacher = new Teacher(teacher, "");

        Teacher.createTeacher(newTeacher, function(error, teacher) {
            if (error) {
                if (error.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    console.log("Teacher with Email Address: " + newTeacher.email_address + " already exist.");
                    resolve(newTeacher.email_address);
                } else {
                    reject(error);
                }
            } else {
                console.log("Teacher with Email Address: " + newTeacher.email_address + " is created successfully!");
                resolve(newTeacher.email_address);
            }
        });
    });
}

var createStudents = function (students) {
    return new Promise(function (resolve, reject) {
        let promises = [];

        for (var i = 0; i < students.length; i++) {
            var newStudent = new Student(students[i], "");
            promises.push(createStudent(newStudent));
        }

        Promise.all(promises)
        .then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

var createStudent = function (newStudent) {
    return new Promise(function (resolve, reject){
        Student.createStudent(newStudent, function(error, student) {
            if (error) {
                if (error.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    console.log("Student with Email Address: " + newStudent.email_address + " already exist.");
                    resolve(newStudent.email_address);
                } else {
                    reject(error);
                }
            } else {
                console.log("Student with Email Address: " + newStudent.email_address + " is created successfully!");
                resolve(newStudent.email_address);
            }
        });
    });
}

var createRegistration = function (teacher, student) {
    return new Promise(function (resolve, reject) {
        var newRegistration = new Registration(teacher, student);

        Registration.getRegistrationByEmailAddresses(newRegistration, function(error, registration) {
            if (error) {
                reject(error);
            } else {
                if (registration.length < 1) {
                    Registration.createRegistration(newRegistration, function(error, registration) {
                        if (error) {
                            reject(error);
                        } else {
                            console.log("Student with Email Address: " + newRegistration.student_email_address + " is registered to Teacher with Email Address: " + newRegistration.teacher_email_address);
                            resolve();
                        }
                    });
                } else {
                    console.log("Student with Email Address: " + newRegistration.student_email_address + " is already registered to Teacher with Email Address: " + newRegistration.teacher_email_address);
                    resolve();
                }
            }
        });
    });
}

var validateListOfEmails = function (emails) {
    var isValid = true;

    for (var i = 0; i < emails.length; i++) {
        if (!emailValidator.validate(emails[i])) {
            isValid = false;
            break;
        }
    }

    return isValid;
}