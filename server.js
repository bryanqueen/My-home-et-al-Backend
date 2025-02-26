const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 4000
const walletRoutes = require('./routes/walletRoutes');
const adminWalletRoutes = require('./routes/adminWalletRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');

const productSubCategoryRoutes = require('./routes/productSubCategoryRoutes');  // new feature routes
const bannerRoutes = require('./routes/bannerRoutes') // new feature routes

const reviewRoutes = require('./routes/reviewRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const addressRoutes = require('./routes/addressRoutes');
const suggestionRoutes = require('./routes/suggestionRoutes');



const path = '/api/v1'


//Initialize App
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Connect DB
async function connectDB() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MONGO_URI:', process.env.MONGO_URI);
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongoose Connection established @${connection.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

app.get('/',(req, res) => {
    res.send(`<h1>Welcome to MyHomeetal API</h1>`)
});



//Routes Middlewares
app.use(`${path}/wallet`, walletRoutes);
app.use(`${path}/admin`, adminRoutes);
app.use(`${path}/user`, userRoutes);
app.use(`${path}/product`, productRoutes);
app.use(`${path}/product-category`, productCategoryRoutes);

app.use(`${path}/sub-category`, productSubCategoryRoutes); // new routes
app.use(`${path}/banner`, bannerRoutes); // new routes

app.use(`${path}/review`, reviewRoutes);
app.use(`${path}/admin-wallet`, adminWalletRoutes);
app.use(`${path}/order`, orderRoutes);
app.use(`${path}/payment`, paymentRoutes);
app.use(`${path}/address`, addressRoutes);
app.use(`${path}/suggestion`, suggestionRoutes);
//Webhook Route middleware
app.use(`${path}/webhook`, webhookRoutes);
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: err.message });
  });
app.use('*', (req, res) => {
    console.log('Reached unknown route');
    res.status(404).json({ error: 'Route not found' });
 });
 app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
  });



//Database Connection must be established before listening to port
connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`This Server is running locally on port ${port}`);
    })
})
