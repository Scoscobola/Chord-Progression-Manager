const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const progressionRouter = require('./routers/progression');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(progressionRouter);


app.listen(port, () => {
    console.log('Server is listening on ' + port);
})