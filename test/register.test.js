"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

var Registration = require('../app/models/registration.js');
var Student = require('../app/models/student.js');
var Teacher = require('../app/models/teacher.js');

chai.use(chaiHttp);

describe('Testing register API', () => {
    after((done) => {
        Registration.deleteRegistration(new Registration("teacher1@gmail.com", "student1@gmail.com"), (err) => { 
            Registration.deleteRegistration(new Registration("teacher2@gmail.com", "student1@gmail.com"), (err) => { 
                Registration.deleteRegistration(new Registration("teacher2@gmail.com", "student2@gmail.com"), (err) => { 
                    Student.deleteStudent("student1@gmail.com", (err) => { 
                        Student.deleteStudent("student2@gmail.com", (err) => { 
                            Teacher.deleteTeacher("teacher1@gmail.com", (err) => { 
                                Teacher.deleteTeacher("teacher2@gmail.com", (err) => { 
                                    done();           
                                });           
                            });           
                        });          
                    });                
                });           
            });        
        });        
    });

    describe("/POST register", () => {
        it("should return bad request error if \"students\" key is not provided in JSON request", (done) => {
            let requestBody = {
                "teacher": "teacherken@gmail.com",
                "student":
                    [
                        "studentjon@gmail.com",
                        "studenthon@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if \"teacher\" key is not provided in JSON request", (done) => {
            let requestBody = {
                "students":
                    [
                        "studentjon@gmail.com",
                        "studenthon@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if \"students\" key is not an array in JSON request", (done) => {
            let requestBody = {
                "teacher": "teacherken@gmail.com",
                "students": "studentjon@gmail.com"
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if \"teacher\" key is an array in JSON request", (done) => {
            let requestBody = {
                "teacher": 
                    [
                        "teacherjon@gmail.com",
                        "teacherhon@gmail.com"
                    ],
                "students":
                    [
                        "studentjon@gmail.com",
                        "studenthon@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if there is no student email address provided", (done) => {
            let requestBody = {
                "teacher": "teacherken@gmail.com",
                "students":
                    [
                    
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if the email address of the teacher provided is blank", (done) => {
            let requestBody = {
                "teacher": "",
                "students":
                    [
                        "studentjon@gmail.com",
                        "studenthon@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if any of the email addresses provided is invalid", (done) => {
            let requestBody = {
                "teacher": "teacherken@gmail.com",
                "students":
                    [
                        "student@jon@gmail.com",
                        "studenthon@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should register a student to a specific teacher", (done) => {
            let requestBody = {
                "teacher": "teacher1@gmail.com",
                "students":
                    [
                        "student1@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(204);
                done();
            });
        });

        it("should register a list of students (> 1) to a specific teacher", (done) => {
            let requestBody = {
                "teacher": "teacher2@gmail.com",
                "students":
                    [
                        "student1@gmail.com",
                        "student2@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/register")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(204);
                done();
            });
        });
    });
});