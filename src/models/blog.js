const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: { type: String, required: false },
    title: { type: String, required: true },
    describtion: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
},
{
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);