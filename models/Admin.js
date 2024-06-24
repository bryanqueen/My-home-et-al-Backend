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
        enum: ['Employee Admin', 'Super Admin']
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String
    },
    image: {
        type: String
    },
    address: {
        type: String
    },
    phone_no: {
        type: String
    },
    gender: {
        type: String
    },
    emergency_contact_name: {
        type: String
    },
    emergency_contact_relationship: {
        type: String
    },
    emergency_contact_phone: {
        type: String
    },
    employee_id: {
        type: String
    },
    start_date: {
        type: String
    },
    employment_type: {
        type: String
    },
    salary: {
        type: String
    },
    position: {
        type: String
    }
});
module.exports = Admin = model('Admin', adminSchema)