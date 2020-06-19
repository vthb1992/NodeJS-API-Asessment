"use strict";

module.exports = function(app) {
    var appController = require('../controllers/appController.js');
    var apiEndpoint = "/api/";

    // List of Routes
    app.route(apiEndpoint + 'register')
        .post(appController.register);
    
    /*app.route(apiEndpoint + 'commonstudents')
        .get(appController.create_a_task);

    app.route(apiEndpoint + 'suspend')
        .post(appController.create_a_task);
    
    app.route(apiEndpoint + 'retrievefornotifications')
        .post(appController.create_a_task);*/
        
};