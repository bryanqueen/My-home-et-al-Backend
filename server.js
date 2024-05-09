const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose')
const port = process.env.PORT || 4000
const walletRoutes = require('./routes/walletRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');


const path = '/api/v1'


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
app.use(`${path}/wallet`, walletRoutes);
app.use(`${path}/admin`, adminRoutes);
app.use(`${path}/user`, userRoutes);
app.use(`${path}/product`, productRoutes);
app.use(`${path}/product-category`, productCategoryRoutes)



//Database Connection must be established before listening to port
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`This Server is running locally on port ${port}`);
    })
})
