const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    // _id: { type: String, required: false },
    // id: { type: String, required: true },
    _id: { type: String, required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
},
{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);