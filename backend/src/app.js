const dotenv = require('dotenv');
dotenv.config();

// Express App Setup
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid/v4');
const api = require('./api');
const config = require('./config');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny'))
app.use('/api', api);

const port = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`
      #####################################
        Server listening on port: ${port}
        Database is: ${config.pgDatabase}
        User is: ${config.pgUser}
      #####################################
    `)
});
