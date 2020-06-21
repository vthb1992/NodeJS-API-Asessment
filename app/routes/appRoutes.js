"use strict";

module.exports = function(app) {
    var appController = require('../controllers/appController.js');
    var apiEndpoint = "/api/";

    // List of API routes exposed
    app.route(apiEndpoint + 'register')
        .post(appController.register);

    app.route(apiEndpoint + 'commonstudents')
        .get(appController.commonStudents);
    
    app.route(apiEndpoint + 'suspend')
        .post(appController.suspend);

    app.route(apiEndpoint + 'retrievefornotifications')
        .post(appController.retrieveForNotifications);
};