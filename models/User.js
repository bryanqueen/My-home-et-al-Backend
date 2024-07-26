const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const userSchema = new Schema({
    // googleId: {
    //     type: String,
    //     unique: true,
    //     sparse: true
    // },
    // facebookId: {
    //     type: String,
    //     unique: true,
    //     sparse: true
    // },
    firstname: {
        type: String,
        required: true
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
    },
    points: {
        type: Number,
        default: 100
    },
    referralCode: {
        type: String,
        unique: true
    },
    referredBy: {
        type: String,
        default: null
    },
    hasMadePurchase: {
        type: Boolean,
        default: false
    }

});

const User = model('User', userSchema);
module.exports = User;