const mongoose = require('mongoose');

// Define schema for Notifications collection
const notificationSchema = new mongoose.Schema({
    recipientType: {
        type: String,
        enum: ['all', 'user', 'driver'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    messageText: {
        type: String,
        required: true
    },
    selectedUsers: {
        type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
        default: [],
        required: function () {
            return this.recipientType === 'user'; // Required if recipientType is 'user'
        }
    },
    selectedDrivers: {
        type: [mongoose.Schema.Types.ObjectId], // Array of driver IDs
        default: [],
        required: function () {
            return this.recipientType === 'driver'; // Required if recipientType is 'driver'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define model based on the schema
const Notification = mongoose.model('notifications', notificationSchema);

module.exports = Notification;
