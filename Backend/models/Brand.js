const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, // Assuming you will store the image path
        required: true
    },
    timeTemps: {
        type: Date,
        default: Date.now, // Setting the default value to the current date
    },
});

// Create a model based on the schema
module.exports = mongoose.model("brands", brandSchema);