const mongoose = require('mongoose');
const modelSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands', // Reference to the Brand model data base table name
        required: true
    },
    timeTemps: {
        type: Date,
        default: Date.now, // Setting the default value to the current date
    },
});

// Create a model based on the schema
module.exports = mongoose.model("models", modelSchema);