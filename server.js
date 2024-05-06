const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose')
const port = process.env.PORT || 4000
const walletRoutes = require('./routes/walletRoutes')


const path = '/api/v1/'


//Initialize App
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Connect DB
async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongoose Connection established @${connection.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}

app.get('/',(req, res) => {
    res.json('Welcome to Myhomeetal API')
})

//Routes Middlewares
app.use(`${path}wallet`, walletRoutes)



//Database Connection must be established before listening to port
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`This Server is running locally on port ${port}`);
    })
})
