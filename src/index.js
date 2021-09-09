const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const progressionRouter = require('./routers/progression');

// Create express instance and establish port
const app = express();
const port = process.env.PORT;

// Use user and progression routers.
// Middleware to convert incoming request objects to JSON format.
app.use(express.json());
app.use(userRouter);
app.use(progressionRouter);

// Begin listening for requests.
app.listen(port, () => {
    console.log('Server is listening on ' + port);
})