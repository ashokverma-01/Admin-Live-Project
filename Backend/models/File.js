const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path: String,

});

module.exports = mongoose.model("File", fileSchema);
