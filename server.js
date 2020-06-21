var express = require('express'),
  app = express(),
  port = process.env.PORT || 8888;

var appRoutes = require('./app/routes/approutes.js');

var bodyParser = require('body-parser');
  
app.listen(port, () => {
  console.log("GovTech Dev Assessment RESTful API server started on: " + port);
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(function(error, request, response, next) {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    response.status(400).send({ message: "Bad JSON Body Request" });
  } else next();
});

appRoutes(app);

module.exports = app;