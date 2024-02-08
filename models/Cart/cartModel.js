const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cartSchema = new Schema({
cart:[ { 
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'product_details'
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'categories',
    },
    subCategoryId: {
        type:Schema.Types.ObjectId,
        ref:'categories',
    },
    brand:{
        type:String,
    },
    modelNo:{
        type:String,
    },
    quantity:{
        type:Number,
    },
    orderId:{
        type:String,
        // required:true,
    },
    price:{
        type:Number,
    },
    description:{
        type:String,
    },
    color:{
        type:String,
    },
    salesQuantity:{
        type:Number,
    },
    status:{
        type:String,
        enum:['out of stock', 'available', 'booked', 'damaged'],
        default:'available'
    },
    size:[String],
    images:[String],
    purchasedDate:Date,
    salesDate:Date,
    returnedDate:Date,

    
    discount:{
        discountItem:Boolean,
        discountType:{
            type:String,
            enum:['percentage','value']
        },
        discountValue: String
   
    },
}],
totalPrice:Number,
   },{
       timestamps: true
   })
   
   module.exports = mongoose.model('cart_details',cartSchema);
   