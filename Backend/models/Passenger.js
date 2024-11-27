const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
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
  active: {
    type: Boolean,
    default: true, // Default value for active status is true (active)
  }
});

const Passenger = mongoose.model('passengers', passengerSchema);

module.exports = Passenger;
