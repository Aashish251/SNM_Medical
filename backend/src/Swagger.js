const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'SNM Medical API',
    description: 'API documentation for SNM Medical application',
    version: '1.0.0'
  },
  host: 'localhost:5000'
};

const outputFile = './swagger-output.json';

const routes = [
  './src/routes/registration.js',
  './src/routes/auth.js', 
  './src/routes/dashboard.js', 
  './src/routes/search.js', 
  './src/routes/dutychart.js', 
  './src/routes/reports.js'
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
swaggerAutogen(outputFile, routes, doc);