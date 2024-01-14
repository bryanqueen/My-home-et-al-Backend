const express = require('express');


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