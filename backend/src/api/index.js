const express = require('express');
const materialRouter = require('./routes/materialRouter');
const speciesRouter = require('./routes/speciesRouter');

const api = express();

api.use('/materials', materialRouter);

api.use('/species', speciesRouter);

api.get('/processes', (req, res) => {
  res.send({
    message: 'get processes called',
  });
});

module.exports = api;