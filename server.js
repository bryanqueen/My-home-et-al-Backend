const express = require('express');
// const cors = require('cors');


const date = Date.now();
const readableDate = new Date(date);
console.log(readableDate);


//Initialize App
const app = express();

//Middlewares
app.use(express.json());


//Initialize Port
const port = 6000;

//App initialized to listen to port

app.listen(port, () => {
    console.log(`This Server is running locally on port ${port}`);
})