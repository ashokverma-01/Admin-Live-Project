const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true
    },
    totalCoupon: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ["percentage", "flat"],
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    },
    userType: {
        type: String,
        enum: ["all", "new", "existing"],
        required: true
    },
    maxUsers: {
        type: Number,
        required: true
    },
    minAmount: {
        type: Number,
        required: true
    },
    maxAmount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const Discount = mongoose.model('discounts', discountSchema);

module.exports = Discount;
