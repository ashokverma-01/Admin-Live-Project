
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId, // Assuming brand is stored as ObjectId
    ref: 'brands', // Reference to the Brand model
    required: true
  },
  model: {
    type: mongoose.Schema.Types.ObjectId, // Assuming brand is stored as ObjectId
    ref: 'models', // Reference to the Brand model
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId, // Assuming variant is stored as ObjectId
    ref: 'varients', // Reference to the Variant model
    required: true
  },
  carName: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
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

module.exports = mongoose.model("addcars", carSchema);
