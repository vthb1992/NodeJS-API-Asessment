"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

var Registration = require('../app/models/registration.js');
var Student = require('../app/models/student.js');
var Teacher = require('../app/models/teacher.js');

chai.use(chaiHttp);

describe('Testing commonStudents API', () => {
    before((done) => {
        Teacher.createTeacher(new Teacher("teacher1@gmail.com", ""), (err) => { 
            Teacher.createTeacher(new Teacher("teacher2@gmail.com", ""), (err) => { 
                Student.createStudent(new Student("student1@gmail.com", ""), (err) => { 
                    Student.createStudent(new Student("student2@gmail.com", ""), (err) => { 
                        Registration.createRegistration(new Registration("teacher1@gmail.com", "student1@gmail.com"), (err) => { 
                            Registration.createRegistration(new Registration("teacher1@gmail.com", "student2@gmail.com"), (err) => { 
                                Registration.createRegistration(new Registration("teacher2@gmail.com", "student2@gmail.com"), (err) => { 
                                    done();           
                                });            
                            });            
                        });            
                    });          
                });         
            }); 
        });        
    });

    after((done) => {
        Registration.deleteRegistration(new Registration("teacher1@gmail.com", "student1@gmail.com"), (err) => { 
            Registration.deleteRegistration(new Registration("teacher1@gmail.com", "student2@gmail.com"), (err) => { 
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

    describe("/GET commonStudents", () => {
        it("should return bad request error if there isnt any \"teacher\" request query parameters", (done) => {
            let requestQuery = "";

            chai.request(server)
                .get("/api/commonstudents" + requestQuery)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if any of the email addresses is invalid", (done) => {
            let requestQuery = "?teacher=teacher%40vic%40gmail.com&teacher=teacherjon%40gmail.com";

            chai.request(server)
                .get("/api/commonstudents" + requestQuery)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return error if any of the teachers provided does not exist", (done) => {
            let requestQuery = "?teacher=teacher1%40gmail.com&teacher=teacher0%40gmail.com";

            chai.request(server)
                .get("/api/commonstudents" + requestQuery)
                .end((error, response) => {
                    response.should.have.status(500);
                done();
            });
        });

        it("should retrieve the correct list of students common to just one teacher in the given list", (done) => {
            let requestQuery = "?teacher=teacher1%40gmail.com";

            chai.request(server)
                .get("/api/commonstudents" + requestQuery)
                .end((error, response) => {
                    response.should.have.status(200);
                    var students = ["student1@gmail.com", "student2@gmail.com"];
                    response.body.should.have.property('students').eql(students);
                done();
            });
        });

        it("should retrieve the correct list of students common to more than one teachers in the given list", (done) => {
            let requestQuery = "?teacher=teacher1%40gmail.com&teacher=teacher2%40gmail.com";

            chai.request(server)
                .get("/api/commonstudents" + requestQuery)
                .end((error, response) => {
                    response.should.have.status(200);
                    var students = ["student2@gmail.com"];
                    response.body.should.have.property('students').eql(students);
                done();
            });
        });
    });
});