const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const searcLogSchema = new Schema({
    query: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    ipAddress: {
        type: String,
        required: false
    },
    resultsCount: {
        type: Number,
        default: 0,
        min: 0
    },
    timestamps: {
        type: Date,
        default: Date.new
    }
});
module.exports = SearchLog = model('SearchLog', searcLogSchema);