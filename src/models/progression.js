// Defining the progression schema/model.
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
    // Each chord is an object containing the name
    // and a string representation of the fret numbers.
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
    // Establishing relationship. Indicating foreign key as user id.
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Progression = mongoose.model('Progression', progressionSchema);

module.exports = Progression;