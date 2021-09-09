const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Progression = require('./progression');

// Defining user schema/model.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minLength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error("Password must not contain the word 'password'");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if (value < 0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Establishing key relationship with virtual attribute.
userSchema.virtual('progressions', {
    ref: 'Progression',
    localField: "_id",
    foreignField: 'owner'
});

// Called when a user signs up or logs in.
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

// Omitting the password and tokens attributes.
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// Ablility to search for a user by email and password for login purposes.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}

// In the case the user has just been created or is updated, hash their password.
userSchema.pre('save', async function(next){
    const user = this;

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

// In the case the user deletes their profile, delete their progressions.
userSchema.pre('remove', async function(next){
    const user = this;

    await Progression.deleteMany({owner: user._id});

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;

