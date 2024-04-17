const express = require('express');
require('dotenv').config();
const cors = require('cors');

// const randomId = crypto.randomUUID().split('')
// console.log(randomId)

//Initialize App
const app = express();

//Middlewares
app.use(express.json());
app.use(cors)


//Initialize Port
const port = 6000;

//App initialized to listen to port

app.listen(port, () => {
    console.log(`This Server is running locally on port ${port}`);
})