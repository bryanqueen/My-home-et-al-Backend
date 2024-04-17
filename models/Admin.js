const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Employer Admin', 'Super Admin']
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = adminSchema = model('Admin', adminSchema)