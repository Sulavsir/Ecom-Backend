const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product_Payment = new Schema({
  productDetails:[{}],
<<<<<<< bf2ddf562bed4ecd7e7e5433c2ab3974f8b548de
  clientID: {
    type:mongoose.Schema.ObjectId,
    ref:'Customer-model',
=======
  clientID:{
    type:mongoose.Schema.ObjectId,
    ref:'Customer-model'
>>>>>>> 80ba93a9e51617b01707beec8539b8f93623932f
  },
  transactionId: {
    type: String,
  },
  brand: {
    type: String,
  },
  salesDate: {
    type: Date,
  },
  size:[Number],
  discount: {
    discountItem: Boolean,
    discountType: {
      type: String,
      enum: ["percentage", "value", "quantity"],
    },
    discountValue: String,
  },
  discountedAmount: {
    type: Number,
  },
  distanceAmount: {
    type: Number,
  },
  distance: {
    type: String,
  },
  deliveredDate: {
    type: Date,
  },
  deliveryTpye: {
    type: String,
    enum: ["pickup", "homedelivery"],
    required:true
  },
  status: {
    type: String,
    enum: [
      "canceledByUser",
      "cancelbyVendor",
      "new order",
      "acknowledged",
      "outfor_delivery",
      "completed",
    ],
  },
  totalamount: {
    type: Number,
    required: true,
  },
  isGems: {
    type: Boolean,
    default: false,
  },
  paymenMode: {
    type: String,
    enum: ["KHALTI", "STRIPE", "CASH_ON_DELIVERY", "HAND_CASH"],
    required: true,
  },
});
module.exports = mongoose.model("product_payment", Product_Payment);