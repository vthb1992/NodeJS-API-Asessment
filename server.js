var express = require('express'),
  mysql = require('./db.js'),
  app = express(),
  port = process.env.PORT || 8888;

  
app.listen(port, () => {
  console.log("GovTech Dev Assessment RESTful API server started on: " + port);
  });