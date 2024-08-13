const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const emailSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    }
});
module.exports = Email = model('Email', emailSchema);