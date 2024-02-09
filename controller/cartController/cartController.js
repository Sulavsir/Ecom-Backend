const { iteratee } = require('lodash');
const cartModel = require('../../models/Cart/cartModel')
const ProductSchema = require('../../models/product/productSchema');

// toadd in cart
const {generateOrderID} = require('../../helper/generate_orderid');

const orderId = await generateOrderID();

const addToCart = async (req, res) => {
    const data  = req.body;
    if(!data){
        return res.status(400).json({
            msg:"Please choose a products"
        })
    }
    let newArray =[];
  try {
    //   console.log('first')
      if (data.cart.length > 0) {
          for (const cart of data.cart) {
              const condition = {
                  _id: cart._id
              };

              const product = await ProductSchema.findOne(condition);

              if (cart.quantity > product.quantity) {
                  return res.status(400).json({ message: "Out of stock" });
              }

              const checkAmount = cart.quantity * product.price;
              if (checkAmount !== cart.price) {
                  return res.status(200).json({ message: "Incorrect price for the products" });
              }

              const pdcts = product.category.toString();
              if (cart.category !== pdcts) {
                  return res.status(400).json({ message: 'This category is not available' });
              }

              if (cart.modelNo !== product.modelNo) {
                  return res.status(200).json({ message: "Model number is not the same or is not in stock" });
              }
              
              newArray.push({...cart,productId:cart._id});
          }
        const savedCart =  await cartModel.create({...data,cart:newArray,orderId:orderId})

        if(savedCart){
            return res.status(200).json({ message: "All validated. You are ready to go..." });
        }
        return res.status(400).json({
            msg:'unable to save your data'
        })

      } else {
          return res.status(400).json({ message: "No data provided" });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCart = async(req,res)=>{
    try {
        const {_id,cartId,quantity,price} = req.body
        if(!req.body){
            res.status(400).json({
                msg:"No data found or is not given"
            });
        }
        // const total = await ProductSchema.find()
        const productfind = await cartModel.findOne({_id:_id}) 
        const found = await productfind?.cart?.find(cartDetails => cartDetails._id ==  cartId)

        console.log("this is it",found);
        if(found){
            found.quantity = quantity;
            found.price = price;

            found.save();
        }
        return res.status(200).json({
            msg:"database updated successfully",
            Data:found
        })
            
        
    } 
    catch (error) {
        
    }
}


module.exports={
    addToCart,
    updateCart
}