const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
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
  car: {
    type: mongoose.Schema.Types.ObjectId, // Assuming variant is stored as ObjectId
    ref: 'addcars', // Reference to the Variant model
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

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
