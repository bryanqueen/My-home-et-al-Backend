const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const suggestionsSchema = new Schema({
    suggestionText: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true
    },
    popularityScore: {
        type: Number,
        required: true,
        index: true
    },
    keywords: {
        type: [String],
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

//Compound Index
suggestionsSchema.index({suggestionText: 1, type: 1})

//Text Index
suggestionsSchema.index({suggestionText: 'text', keyword: 'text'})

module.exports = Suggestion = model('Suggestion', suggestionsSchema)