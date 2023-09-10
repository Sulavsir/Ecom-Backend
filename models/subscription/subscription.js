const mongoose = require('mongoose');

const subscription = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      plans: [{
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        allowcategory: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }]
})


module.exports = mongoose.model("subscription",subscription)