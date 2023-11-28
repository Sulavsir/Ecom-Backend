const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code:{
    type: String,
    unqiue: true,
    required: true
  },
  AdminId:{
    type:mongoose.Types.ObjectId,
    // required: true
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'product_details', // reference to the Event model
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  usage: {
    type: Number,
    required: true,
    default: 0,
  },
  maxUsage: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
