const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: { type: String, required: false },
    name: { 
        type: String, 
        required: true, 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: false , default: ''},
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    authenticationType: {
        type: String,
        enum: ['email', 'google'],
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);