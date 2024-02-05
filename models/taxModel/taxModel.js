const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tax name is required'],
  },
  country:{
    type: String,
    required: true
  },
  chargePercentage: {
    type: Number,
    required: [true, 'Tax charge percentage is required'],
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  isGlobal: {
    type: Boolean,
    default: false,
  },
  submitButton: {
    type: Boolean,
    default: false,
  },
});

const Tax = mongoose.model('Tax', taxSchema);

module.exports = Tax;
