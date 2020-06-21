"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

var Registration = require('../app/models/registration.js');
var Student = require('../app/models/student.js');
var Teacher = require('../app/models/teacher.js');

chai.use(chaiHttp);

describe('Testing retrieveForNotifications API', () => {
    before((done) => {
        Teacher.createTeacher(new Teacher("teacher1@gmail.com", ""), (err) => { 
            Teacher.createTeacher(new Teacher("teacher2@gmail.com", ""), (err) => { 
                Teacher.createTeacher(new Teacher("teacher3@gmail.com", ""), (err) => {
                    Teacher.createTeacher(new Teacher("teacher4@gmail.com", ""), (err) => {
                        Student.createStudent(new Student("student1@gmail.com", ""), (err) => { 
                            Student.createStudent(new Student("student2@gmail.com", ""), (err) => {
                                Student.createStudent(new Student("student3@gmail.com", ""), (err) => { 
                                    Student.createStudent(new Student("student4@gmail.com", ""), (err) => {
                                        Registration.createRegistration(new Registration("teacher1@gmail.com", "student1@gmail.com"), (err) => { 
                                            Registration.createRegistration(new Registration("teacher1@gmail.com", "student2@gmail.com"), (err) => { 
                                                Registration.createRegistration(new Registration("teacher2@gmail.com", "student2@gmail.com"), (err) => { 
                                                    Registration.createRegistration(new Registration("teacher3@gmail.com", "student3@gmail.com"), (err) => { 
                                                        Registration.createRegistration(new Registration("teacher3@gmail.com", "student4@gmail.com"), (err) => { 
                                                            Student.suspendStudent("student4@gmail.com", (err) => {
                                                                done();    
                                                            });    
                                                        });           
                                                    });          
                                                });            
                                            });            
                                        });    
                                    });  
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
                    Registration.deleteRegistration(new Registration("teacher3@gmail.com", "student3@gmail.com"), (err) => {
                        Registration.deleteRegistration(new Registration("teacher3@gmail.com", "student4@gmail.com"), (err) => {
                            Student.deleteStudent("student1@gmail.com", (err) => { 
                                Student.deleteStudent("student2@gmail.com", (err) => { 
                                    Student.deleteStudent("student3@gmail.com", (err) => { 
                                        Student.deleteStudent("student4@gmail.com", (err) => { 
                                            Teacher.deleteTeacher("teacher1@gmail.com", (err) => { 
                                                Teacher.deleteTeacher("teacher2@gmail.com", (err) => { 
                                                    Teacher.deleteTeacher("teacher3@gmail.com", (err) => { 
                                                        Teacher.deleteTeacher("teacher4@gmail.com", (err) => { 
                                                            done();           
                                                        });              
                                                    });             
                                                });           
                                            });  
                                        });  
                                    });       
                                });          
                            });  
                        });
                    });              
                });           
            });        
        });        
    });

    describe("/POST retrieveForNotifications", () => {
        it("should return bad request error if \"teacher\" key is not provided in JSON request", (done) => {
            let requestBody = {
                "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if \"notification\" key is not provided in JSON request", (done) => {
            let requestBody = {
                "teacher":  "teacherken@gmail.com",
                "notifications": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if \"teacher\" key is an array in JSON request", (done) => {
            let requestBody = {
                "teacher":  ["teacherken@gmail.com"],
                "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if \"notification\" key is an array in JSON request", (done) => {
            let requestBody = {
                "teacher":  "teacherken@gmail.com",
                "notification": 
                    [
                        "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com",
                        "Bye students!"
                    ]
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if the email address of the teacher provided is blank", (done) => {
            let requestBody = {
                "teacher":  "",
                "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if the notification text provided is blank", (done) => {
            let requestBody = {
                "teacher":  "teacherken@gmail.com",
                "notification": ""
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return bad request error if the email address of the teacher is invalid", (done) => {
            let requestBody = {
                "teacher":  "teacher@ken@gmail.com",
                "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(400);
                done();
            });
        });

        it("should return an error if the teacher does not exist", (done) => {
            let requestBody = {
                "teacher":  "teacher0@gmail.com",
                "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(500);
                done();
            });
        });

        it("should receive the correct list of recipients if students are not suspended, registered with the teacher provided and no mentions in notification text", (done) => {
            let requestBody = {
                "teacher":  "teacher3@gmail.com",
                "notification": "Hello students!"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(200);
                    var recipients = ["student3@gmail.com"];
                    response.body.should.have.property('recipients').eql(recipients);
                done();
            });
        });

        it("should receive the correct list of recipients if students are not suspended, not registered with the teacher provided and mentioned in notification text", (done) => {
            let requestBody = {
                "teacher":  "teacher4@gmail.com",
                "notification": "Hello students! @student2@gmail.com @student3@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(200);
                    var recipients = ["student2@gmail.com", "student3@gmail.com"];
                    response.body.should.have.property('recipients').eql(recipients);
                done();
            });
        });

        it("should receive the correct list of recipients if students are not suspended, registered with the teacher provided and mentioned in notification text", (done) => {
            let requestBody = {
                "teacher":  "teacher3@gmail.com",
                "notification": "Hello students! @student1@gmail.com @student2@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(200);
                    var recipients = ["student1@gmail.com", "student2@gmail.com", "student3@gmail.com"];
                    response.body.should.have.property('recipients').eql(recipients);
                done();
            });
        });

        it("should receive the correct list of recipients without any duplicates", (done) => {
            let requestBody = {
                "teacher":  "teacher1@gmail.com",
                "notification": "Hello students! @student2@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(200);
                    var recipients = ["student2@gmail.com", "student1@gmail.com"];
                    response.body.should.have.property('recipients').eql(recipients);
                done();
            });
        });

        it("should receive the correct list of recipients without any of them being suspended", (done) => {
            let requestBody = {
                "teacher":  "teacher3@gmail.com",
                "notification": "Hello students! @student2@gmail.com"
            }

            chai.request(server)
                .post("/api/retrievefornotifications")
                .send(requestBody)
                .end((error, response) => {
                    response.should.have.status(200);
                    var recipients = ["student2@gmail.com", "student3@gmail.com"];
                    response.body.should.have.property('recipients').eql(recipients);
                done();
            });
        });
    });
});