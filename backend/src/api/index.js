const express = require('express');
const materialRouter = require('./routes/materialRouter');
const speciesRouter = require('./routes/speciesRouter');
const processRouter = require('./routes/processRouter');
const locationRouter = require('./routes/locationRouter');

const api = express();

api.use('/materials', materialRouter);
api.use('/species', speciesRouter);
api.use('/processes', processRouter);
api.use('/locations', locationRouter);

module.exports = api;