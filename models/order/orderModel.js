const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    clientId:{
        type:mongoose.Types.ObjectId,
        ref:'Customer-model'
    },
    status:{
        type:String,
        enum:['Ordered', 'delivered','cancledBy-user'],
        default:'Ordered'
    },
    orderId:{
            type:String,
            required:true
    },
    
    productDetails:[{
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
    orderId:{
        type:String,
        required:true,
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
   
    }
}],
},

   {
       timestamps: true
   })
   
   module.exports = mongoose.model('order_details',orderSchema);
