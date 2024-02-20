const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    clientId:{
        type:mongoose.Types.ObjectId,
        ref:'Customer-model'
    },
    orderId:{
        type:String,
        required:true,
    },
    transaction_id:{
        type:String,
        // required:true
    },
    total_amount:Number,
   
   productDetails:
   [{
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'product_details'
    },
    category:{
        type:mongoose.Types.ObjectId, 
        ref:'categories',
    },
    subCategoryId: {
        type:mongoose.Types.ObjectId,
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
   
    price:{
        type:Number,
    },
    description:{
        type:String,
    },
    color:{
        type:String,
    },
    status:{
        type:String,
        enum:['pending', 'orderApproved','delivered', 'cancelByUser'],
        default:'pending'
    },
    salesQuantity:{
        type:Number,
    },
    
    size:[String],
    images:[String],
    purchasedDate:{
        type:Date,
        default:Date.now
    },
    deliveredDate:Date,
    returnedDate:Date,

    discount:{
        discountItem:Boolean,
        discountType:{
            type:String,
            enum:['percentage','value']
        },
        discountValue: String
   
    },
    updatedAt:Date
}] ,

},
   {
       timestamps: true
   })
   
   module.exports = mongoose.model('order_details',orderSchema);
