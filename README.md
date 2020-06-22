
Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses.

## Getting Started

These instructions will get you running/launching a local instance of the API server on your local machine for development and testing purposes.

### Prerequisites

The softwares you need to download and install 
- Node.js [Download Link](https://nodejs.org/en/)
- MySQL [Download Link](https://dev.mysql.com/downloads/)

After installing Node.js, make sure you have Node and NPM installed by running simple commands on Windows Command Prompt, Powershell or a similar command line tool to see what version of each is installed
- Test Node 
```
node -v
```
- Test NPM
```
npm -v
```

After installing MySQL, please set up a new connection on localhost:3306, using username:root and password:password. If you have an existing connection you want to use, you may do the necessary changes to db.config.js file under the config folder. 

### Installing & Setting up

A step by step series that tell you how to get the environment running and launching a local instance of the API server

1. After cloning the project to your desired local directory, please run the following command on the project root directory to install the required node modules. Verify that node_modules folder is created successfully with the installed contents after running the command. 
```
npm install
```

2. To create a new database and the required tables, please run the following commands on the project root directory to run a script. Verify that the database and tables are created on MySQL Workbench.
```
cd initDB
run.bat
```

3. To run and launch a local instance of the API server, please run the following command on the project root directory. Upon successful run, the API server will start on localhost, port 8888.
```
npm start
```

## Running the tests

To run the automated tests for this system, please run the following command on the project root directory. Verify that all 34 unit tests passed successfully.
```
npm test
```
