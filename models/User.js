const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const userSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },
    firstname: {
        type: String,
        reqquired: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    authMethod: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    savedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    purchaseHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    notificatiions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    deliveryAddress: {
        type: String
    },
    otp: {
        type: Number,
        required: false
    },
    otpExpiry: {
        type: Date,
        required: false
    },
    isVerified: {
        type: Boolean,
    }

});

const User = model('User', userSchema);
module.exports = User;