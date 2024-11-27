const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    title: {
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

// Create a model based on the schema
module.exports = mongoose.model("banners", bannerSchema);