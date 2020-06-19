var express = require('express'),
  app = express(),
  port = process.env.PORT || 8888;

var appRoutes = require('./app/routes/approutes.js');

var bodyParser = require('body-parser');
  
app.listen(port, () => {
  console.log("GovTech Dev Assessment RESTful API server started on: " + port);
});

app.use(bodyParser.json());

appRoutes(app);