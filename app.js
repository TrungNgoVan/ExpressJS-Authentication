'use strict'

// Import packages
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const mongoClient = require('mongoose');
const dotenv = require('dotenv');

// Import routers 
const userRouter = require('./routes/userRoute');
const deckRouter = require('./routes/deckRoute');


// Setup connect mongodb database by mongoose
mongoClient.connect('mongodb://127.0.0.1:27017/authentication') // return promise
    .then(() => {
        console.log('Connect db successfully ✅');
    })
    .catch((err) => {
        console.error(`Connect db failed with error ${err} ❌`);
    })

// Create app object
const app = express();

// Middleware
dotenv.config();
app.use(logger('dev'));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Server is OK'
    })
})
app.use('/user', userRouter);
app.use('/deck', deckRouter);
    
// ! Error handle function 
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})


// Start the server
app.listen(3000, () => {
    console.log('http:\\localhost:3000');
})
