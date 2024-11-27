const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    variant: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands', // Reference to the Brand model
        required: true
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'models', // Reference to the Model model
        required: true
    },
    timeTemps: {
        type: Date,
        default: Date.now
    }
});

const Variant = mongoose.model("varients", variantSchema);

module.exports = Variant;
