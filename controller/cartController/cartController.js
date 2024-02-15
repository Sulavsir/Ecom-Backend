const { iteratee } = require('lodash');
const cartModel = require('../../models/Cart/cartModel')
const ProductSchema = require('../../models/product/productSchema');

// toadd in cart
const {generateOrderID} = require('../../helper/generate_orderid');

const orderId = await generateOrderID();

const addToCart = async (req, res) => {
    const data  = req.body;
    console.log(req.user)
    const clientId = req.user._id;
    

    console.log("asdasda",clientId)
    if(!data){
        return res.status(400).json({
            msg:"Please choose a products"
        })
    }
    
  try {
      
          
              const condition = {
                  _id:data.productId
              };

              const product = await ProductSchema.findOne(condition);

              if ( data.quantity > product.quantity) {
                  return res.status(400).json({ message: "Out of stock" });
              }

              const checkAmount =  data.quantity * product.price;
              if (checkAmount !==  data.price) {
                  return res.status(200).json({ message: "Incorrect price for the products" });
              }

              const pdcts = product.category.toString();
              if ( data.category !== pdcts) {
                  return res.status(400).json({ message: 'This category is not available' });
              }

              if ( data.modelNo !== product.modelNo) {
                  return res.status(200).json({ message: "Model number is not the same or is not in stock" });
              }
              const orderId = await generateOrderID();
              
          
          
        const savedCart =  await cartModel.create({...data,orderId:orderId,clientId:req.user._id})

        if(savedCart){
            return res.status(200).json({ message: "All validated. You are ready to go..." });
        }
        return res.status(400).json({
            msg:'unable to save your data'
        })

      
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCart = async(req,res)=>{
    try {
        const {cartId,quantity,price} = req.body
        if(!req.body){
            res.status(400).json({
                msg:"No data found or is not given"
            });
        }
        // const total = await ProductSchema.find()
        const productfind = await cartModel.findOne({_id:cartId}) 
        const productDetails = await ProductSchema.findOne({_id:productfind.productId})
        console.log("detailsssssss",productDetails)
        
        const productActualPrice = productDetails.price * quantity;
        console.log("actual price is",productActualPrice)
        if(productActualPrice !== price)
        {
            return res.status(400).json({
                msg:"Please check the amount once",
            })
        }

        // console.log("this is it",productfind);
        if(productfind){
            productfind.quantity = quantity;
            productfind.price = price;

            productfind.save();
            return res.status(200).json({
                msg:"database updated successfully",
                Data:productfind
            })
        }
        return res.status(400).json({
            msg:"database error",
            Data:found
        })
            
        
    } 
    catch (error) {
        res.status(404).json({msg:"Error found"});
    }
}

const displaySpecificCart = async(req,res)=>{
    try {
        const found = await cartModel.find({clientId:req.user._id});    
        if(!found)
        {
            return res.status(400).json({msg:"No cart data found"});
        }
        return res.status(200).json({
            msg:"Cart data found",
            Data:found,
        })

    } 
    catch (error) {
        return res.status(404).json({
            msg:"Internal Server Error"
        });
    }
}
const deleteUsersData = async(req,res)=>{
    const cartId = req.body.cartId;
  try {
    const deleted = await cartModel.findOneAndDelete(cartId)
    if(!deleted)
    {
        return res.status(400).json({msg:"No cart data found"});
    }
    return res.status(200).json({
        msg:"data deleted successfully",
        Data:deleted
    })
  } catch (error) {
    return res.status(404).json({
        msg:"Internal Server Error"
    });
  }
}

module.exports={
    addToCart,
    updateCart,
    displaySpecificCart,
    deleteUsersData
}