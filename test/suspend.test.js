"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

var Student = require('../app/models/student.js');

chai.use(chaiHttp);

describe('Testing suspend API', () => {
    before((done) => {
        var newStudent = new Student("student1@gmail.com", "");
        Student.createStudent(newStudent, (err) => { 
           done();           
        });        
    });

    after((done) => {
        Student.deleteStudent("student1@gmail.com", (err) => { 
           done();           
        });        
    });

    describe("/POST suspend", () => {
        it("should return bad request error as \"student\" key is not provided in JSON request", (done) => {
            let requestBody = {
                "teacher" : "test@gmail.com"
            }

            chai.request(server)
                .post("/api/suspend")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if a list of students is provided in JSON request", (done) => {
            let requestBody = {
                "student":
                    [
                        "student1@gmail.com",
                        "student2@gmail.com"
                    ]
            }

            chai.request(server)
                .post("/api/suspend")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if the email address of the student provided in JSON request is empty", (done) => {
            let requestBody = {
                "student" : ""
            }

            chai.request(server)
                .post("/api/suspend")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if the email address of the student provided in JSON request is not valid", (done) => {
            let requestBody = {
                "student" : "student1@@gmail.com"
            }

            chai.request(server)
                .post("/api/suspend")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should suspend a specific student if exist", (done) => {
            let requestBody = {
                "student" : "student1@gmail.com"
            }

            chai.request(server)
                .post("/api/suspend")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(204);
                done();
            });
        });

        it("should not be able to suspend a specific student again since he/she was already suspended", (done) => {
            let requestBody = {
                "student" : "student1@gmail.com"
            }

            chai.request(server)
                .post("/api/suspend")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(500);
                done();
            });
        });

        it("should not be able to suspend a specific student since he/she does not exist", (done) => {
            let requestBody = {
                "student" : "student2@gmail.com"
            }

            chai.request(server)
                .post("/api/suspend")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(500);
                done();
            });
        });
    });
});