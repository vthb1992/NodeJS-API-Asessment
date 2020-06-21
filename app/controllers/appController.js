"use strict";

var Teacher = require('../models/teacher.js');
var Student = require('../models/student.js');
var Registration = require('../models/registration.js');
var emailValidator = require("email-validator");
var Promise = require('promise');

exports.register = function(request, response) {
    console.log("Register function => Request Body: " + JSON.stringify(request.body));
    var teacher = request.body.teacher;
    var students = request.body.students;
    
    // Validation for the JSON request body
    if (teacher == undefined || students == undefined) {
        console.log("Please provide the email addresses for both the teacher and students for registration.");
        response.status(400).send({ message: 'Please provide the email addresses for both the teacher and students for registration.' });
    } else if (!Array.isArray(students) || Array.isArray(teacher)) {
        console.log("Please provide a teacher\'s email address and an array of students\' email addresses for registration, following the supported JSON Request Body format.");
        response.status(400).send({ message: 'Please provide a teacher\'s email address and an array of students\' email addresses for registration, following the supported JSON Request Body format.' });
    } else if (students.length < 1 || teacher.length < 1) {
        console.log("Please provide a teacher\'s email address and at least one student(s)\' email addresses for registration.");
        response.status(400).send({ message: 'Please provide a teacher\'s email address and at least one student(s)\' email addresses for registration.' });
    } else if (!emailValidator.validate(teacher) || !validateListOfEmails(students)) {
        console.log("At least one of the email addresses are invalid.");
        response.status(400).send({ message: 'At least one of the email addresses are invalid.' });
    } else {
        let createPromises = [];

        createPromises.push(createTeacher(teacher));
        createPromises.push(createStudents(students));

        // Create teacher and student records before registration
        Promise.all(createPromises)
        .then(() => {
            console.log("Teacher and Student records are created successfully if they do not exist yet.");
            
            let registrationPromises = [];
            
            for (let i = 0; i < students.length; i++) {
                registrationPromises.push(createRegistration(teacher, students[i]));
            }

            // Create registration record for each pair of teacher and student 
            Promise.all(registrationPromises)
            .then(() => {
                console.log("Teacher to Students registrations are created successfully if they do not exist yet.");
                response.status(204).end();
            }).catch((error) => {
                console.log(error);
                response.status(500).send({ message: 'Internal Server Error.' });
            })    
        }).catch((error) => {
            console.log(error);
            response.status(500).send({ message: 'Internal Server Error.' });
        });
    }
};

exports.commonStudents = function(request, response) {
    console.log("CommonStudents function => Request Query Teacher: " + request.query.teacher);
    var teachers = request.query.teacher;

    // Validation for request query parameters
    if (teachers == undefined) {
        console.log("Please provide at least one email address of a teacher to retrieve the list of common students.");
        response.status(400).send({ message: 'Please provide at least one email address of a teacher to retrieve the list of common students.' });
    } else if (!Array.isArray(teachers) && !emailValidator.validate(teachers)) {
        console.log("The email address is invalid.");
        response.status(400).send({ message: 'The email address is invalid.' });
    } else if (Array.isArray(teachers) && !validateListOfEmails(teachers)) {
        console.log("At least one of the email addresses are invalid.");
        response.status(400).send({ message: 'At least one of the email addresses are invalid.' });
    } else {
        // Put into an array if there is only a teacher email address under the query parameters
        if (!Array.isArray(teachers)) {
            teachers = teachers.split();
        }

        let checkExistPromises = [];

        for (let i = 0; i < teachers.length; i++) {
            checkExistPromises.push(getTeacherByEmailAddress(teachers[i]));
        }

        // Check if teachers' email address exist
        Promise.all(checkExistPromises)
        .then((result) => {
            if (result.includes("Empty")) {
                console.log("At least one of the teachers\' email address does not exist.");
                response.status(500).send({ message: 'At least one of the teachers\' email address does not exist.' });
            } else {
                let getRegistrationPromises = [];
                
                for (let i = 0; i < teachers.length; i++) {
                    getRegistrationPromises.push(getRegistrationByTeacherEmailAddress(teachers[i]));
                }
                
                // Get all student registrations for each teacher 
                Promise.all(getRegistrationPromises)
                .then((result) => {
                    var totalStudentRegistrations = [];

                    for (let i = 0; i < result.length; i++) {
                        if (result[i].length != 0) {
                            let studentRegistrationsPerTeacher = [];
                            for (let j = 0; j < result[i].length; j++) {
                                studentRegistrationsPerTeacher.push(result[i][j].student_email_address)
                            }
                            totalStudentRegistrations.push(studentRegistrationsPerTeacher);
                        } else {
                            totalStudentRegistrations.push([]);
                        }
                    }

                    // Get list of students who are registered to all the given list of teachers
                    var commonListOfStudents = totalStudentRegistrations.reduce((a, b) => a.filter(value => b.includes(value)));

                    console.log("For the given list of teachers with email addresses: " + teachers + ", the common list of students\' email address registered to all given teachers are: " + commonListOfStudents);
                    response.status(200).json({ "students": commonListOfStudents });
                }).catch((error) => {
                    console.log(error);
                    response.status(500).send({ message: 'Internal Server Error.' });
                })
            }
        }).catch((error) => {
            console.log(error);
            response.status(500).send({ message: 'Internal Server Error.' });
        });
    }
};

exports.suspend = function(request, response) {
    console.log("Suspend function => Request Body: " + JSON.stringify(request.body));
    var student = request.body.student;

    // Validation for the JSON request body
    if (student == undefined) {
        console.log("Please provide an email address of a student for suspension.");
        response.status(400).send({ message: 'Please provide an email address of a student for suspension.' });
    } else if (Array.isArray(student)) {
        console.log("Please provide only one email address of a student for suspension, following the supported JSON Request Body format.");
        response.status(400).send({ message: 'Please provide only one email address of a student for suspension, following the supported JSON Request Body format.' });
    } else if (student.length < 1) {
        console.log("The email address of a student for suspension is empty.");
        response.status(400).send({ message: 'The email address of a student for suspension is empty.' });
    } else if (!emailValidator.validate(student)) {
        console.log("The email address is invalid.");
        response.status(400).send({ message: 'The email address is invalid.' });
    } else {
        // Suspend a student if it exist
        Student.suspendStudent(student, function(error, result) {
            if (error) {
                console.log(error);
                response.status(500).send({ message: 'Internal Server Error.' });
            } else {
                if (result.changedRows == 1) {
                    console.log("Student with Email Address: " + student + " is suspended.");
                    response.status(204).end();
                } else if (result.affectedRows == 1) {
                    console.log("Student with Email Address: " + student + " was already suspended.");
                    response.status(500).send({ message: 'Student was already suspended.' });
                } else {
                    console.log("Student with Email Address: " + student + " does not exist.");
                    response.status(500).send({ message: 'Student to be suspended does not exist.' });
                }
            }
        });
    }
};

exports.retrieveForNotifications = function(request, response) {
    console.log("RetrieveForNotifications function => Request Body: " + JSON.stringify(request.body));
    var teacher = request.body.teacher;
    var notification = request.body.notification;

    // Validation for the JSON request body
    if (teacher == undefined || notification == undefined) {
        console.log("Please provide the email address of the teacher sending the notification and the text of the notification itself.");
        response.status(400).send({ message: 'Please provide the email address of the teacher sending the notification and the text of the notification itself.' });
    } else if (Array.isArray(teacher) || Array.isArray(notification)) {
        console.log("Please provide only 1 email address of the teacher and 1 notification text, following the supported JSON Request Body format.");
        response.status(400).send({ message: 'Please provide only 1 email address of the teacher and 1 notification text, following the supported JSON Request Body format.' });
    } else if (teacher.length < 1 || notification.length < 1) {
        console.log("The email address of the teacher sending the notification or the text of the notification itself is empty.");
        response.status(400).send({ message: 'The email address of the teacher sending the notification or the text of the notification itself is empty.' });
    } else if (!emailValidator.validate(teacher)) {
        console.log("The email address of the teacher sending the notification is invalid.");
        response.status(400).send({ message: 'The email address of the teacher sending the notification is invalid.' });
    } else {
        // Extract the list of @email addresses from notification text
        var listOfMentionedEmailAddresses = extractEmailsFromNotification(notification);
        
        if (!validateListOfEmails(listOfMentionedEmailAddresses)) {
            console.log("At least one of the mentioned email addresses in the notification are invalid.");
            response.status(400).send({ message: 'At least one of the mentioned email addresses in the notification are invalid.' });
        } else {
            var listOfRecipients = listOfMentionedEmailAddresses;

            // Check if teacher exist first
            getTeacherByEmailAddress(teacher)
            .then((result) => {
                if (result == "Empty") {
                    console.log("Teacher with Email Address: " + teacher + " does not exist.");
                    response.status(500).send({ message: 'Teacher who is sending the notification does not exist.' });
                } else {
                    // Get all student registrations under the given teacher 
                    getRegistrationByTeacherEmailAddress(teacher)
                    .then((result) => {
                        for (let i = 0; i < result.length; i++) {
                            listOfRecipients.push(result[i].student_email_address);
                        }

                        // Filter to remove duplicates in recipients list
                        listOfRecipients = listOfRecipients.filter(function(elem, index, self) {
                            return index === self.indexOf(elem);
                        });
                        
                        let promises = [];

                        for (let i = 0; i < listOfRecipients.length; i++) {
                            promises.push(getStudentByEmailAddress(listOfRecipients[i]));
                        }
                        
                        // Finalise the list of recipients that are not suspended
                        Promise.all(promises)
                        .then((result) => {
                            var finalListOfRecipients = [];
                            
                            for (let i = 0; i < result.length; i++) {
                                if (result[i].length != 0 && result[i][0].is_suspended == 0) {
                                    // Push student that is not suspended into the final list
                                    finalListOfRecipients.push(result[i][0].email_address);
                                }
                            }

                            console.log("For Teacher with Email Address: " + teacher + " and notification: " + notification +  ", the recipients are: " + finalListOfRecipients);
                            response.status(200).json({ "recipients": finalListOfRecipients });
                        }).catch((error) => {
                            console.log(error);
                            response.status(500).send({ message: 'Internal Server Error.' });
                        });
                    }).catch((error) => {
                        console.log(error);
                        response.status(500).send({ message: 'Internal Server Error.' });
                    });
                }
            }).catch((error) => {
                console.log(error);
                response.status(500).send({ message: 'Internal Server Error.' });
            });
        }
    }
};

var createTeacher = function(teacher) {
    return new Promise(function(resolve, reject){
        var newTeacher = new Teacher(teacher, "");

        Teacher.createTeacher(newTeacher, function(error, result) {
            if (error) {
                if (error.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    console.log("Teacher with Email Address: " + newTeacher.email_address + " already exist.");
                    resolve();
                } else {
                    reject(error);
                }
            } else {
                console.log("Teacher with Email Address: " + newTeacher.email_address + " is created successfully!");
                resolve();
            }
        });
    });
}

var getTeacherByEmailAddress = function (teacher) {
    return new Promise(function(resolve, reject) {
        Teacher.getTeacherByEmailAddress(teacher, function(error, result) {
            if (error) {
                reject(error);
            } else {
                if (result.length < 1) {
                    resolve("Empty");
                } else {
                    resolve("Exist");
                }
            }
        })
    })
}

var createStudents = function(students) {
    return new Promise(function(resolve, reject) {
        let promises = [];

        for (let i = 0; i < students.length; i++) {
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

var createStudent = function(newStudent) {
    return new Promise(function(resolve, reject){
        Student.createStudent(newStudent, function(error, result) {
            if (error) {
                if (error.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    console.log("Student with Email Address: " + newStudent.email_address + " already exist.");
                    resolve();
                } else {
                    reject(error);
                }
            } else {
                console.log("Student with Email Address: " + newStudent.email_address + " is created successfully!");
                resolve();
            }
        });
    });
}

var getStudentByEmailAddress = function(student) {
    return new Promise(function(resolve, reject) {
        Student.getStudentByEmailAddress(student, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

var createRegistration = function(teacher, student) {
    return new Promise(function(resolve, reject) {
        var newRegistration = new Registration(teacher, student);

        Registration.getRegistrationByEmailAddresses(newRegistration, function(error, result) {
            if (error) {
                reject(error);
            } else {
                if (result.length < 1) {
                    Registration.createRegistration(newRegistration, function(error, result) {
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

var getRegistrationByTeacherEmailAddress = function(teacher) {
    return new Promise(function(resolve, reject) {
        Registration.getRegistrationByTeacherEmailAddress(teacher, function(error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

var validateListOfEmails = function(emails) {
    let isValid = true;

    for (let i = 0; i < emails.length; i++) {
        if (!emailValidator.validate(emails[i])) {
            isValid = false;
            break;
        }
    }

    return isValid;
}

var extractEmailsFromNotification = function(notification) {
    let extractedEmails = [];

    var matchResults = notification.match(/(^| )@[\w-\.]+@([\w-]+\.)+[\w-]+/g);

    if (matchResults != null) {
        for (let i = 0; i < matchResults.length; i++) {
            extractedEmails.push(matchResults[i].trim().substring(1));
        }
    }

    return extractedEmails;
} 