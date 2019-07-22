// Requirements
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Export app to be used in Server.js
module.exports.app = app;

// Add Routes to the app
app.use('/', require('./main/routes/routes').router);
