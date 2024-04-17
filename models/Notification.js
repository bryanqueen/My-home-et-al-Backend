const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
module.exports = Notification = model('Notification', notificationSchema)