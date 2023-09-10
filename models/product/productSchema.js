const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ratingSchema = new Schema({

    point:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref: 'Customer-model'
    }
},{
    timestamps:true
})
const productSchema = new Schema({
 category:{
     type:Schema.Types.ObjectId,
     ref:'categories'
 },
brand:{
    type:String
},
modelNo:{
    type:String
},
quantity:{
   type:Number
},
price:{
   type:Number
},
 description:{
     type:String
 },
 color:{
     type:String
 },
salesQuantity:{
    type:Number
},
 status:{
     type:String,
     enum:['out of stock','available','booked','damaged'],
     default:'available'
 },
 size:[String],
 images:[String],
 purchasedDate:Date,
 solesDate:Date,
 returnedDate:Date,
 createdBy:{
  type:Schema.Types.ObjectId,
  ref:'Admin-model'
 },
 createdAt:Date.now,

 updatedBy:{
    type:Schema.Types.ObjectId,
    ref:'admin'
 },
 updatedAt:{
    type:Date
 },
 isReturnEligible:{
     type:Boolean,
     default:false
 },
 warrentyStatus:{
     type:Boolean
 },
 warrentyPeriod:{
     type:String
 },
 discount:{
     discountItem:Boolean,
     discountType:{
         type:String,
         enum:['percentage','value','quantity']
     },
     discountValue: String

 },
 tags:[String],
 ratings:{
     type:[ratingSchema]
 }

},{
    timestamps: true
})

module.exports = mongoose.model('product_details',productSchema);
