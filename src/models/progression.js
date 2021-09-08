const mongoose = require('mongoose');
const validator = require('validator')

const progressionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    key: {
        type: String,
        required: true,
    },
    chords: [{
        tab: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Progression = mongoose.model('Progression', progressionSchema);

module.exports = Progression;