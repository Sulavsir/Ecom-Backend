const khaltipayment_query = require('./khalti_product_query');
const Client = require('../../models/customer/customerModel');
const {generateOrderID} = require('../../helper/generate_orderid');
const axios = require('axios');
const KhaltiValidation= require('../../helper/validateKhaltidata');
const cartModel = require('../../models/Cart/cartModel');
const orderModel = require('../../models/order/orderModel')


// for khalti 
const initiateUrl = "https://a.khalti.com/api/v2/epayment/initiate/"
const verificationUrl = 'https://a.khalti.com/api/v2/epayment/lookup/'
const authorizationKey = process.env.KhaltiAuth_KEY;

async function khaltiPayment(req, res, next) {
    const data = req.body;
 
    const cacheTimeout =36000;

    try {
        
        const khaltivalidation = await KhaltiValidation(data)
        if(typeof(khaltivalidation)==='object'){
            const error = JSON.stringify(khaltivalidation)
            if(!JSON.parse(error).error?.msg){
                // Your validation was successful, continue with the payment initiation logic
              const khalti = khaltivalidation.calculatedKhaltiData
                const client = await Client.findOne({ _id: '65c5c17bebc3720793e7aefa' });
        
                if (!client) {
                    return res.status(404).json({
                        msg: 'You are unauthorized'
                    });
                }
                   const payload = {
                    "return_url": `https://localhost:7000/api/sales/payment/success/`,
                    "website_url": data.website_url,
                    "amount": khaltivalidation.totalAmount * 100,
                    "purchase_order_id": data?.orderId,
                    "purchase_order_name": "test2",  
                    "product_details":khalti,
                    "customer_info": {
                        "name": client.name,
                        "email": client.email,
                    }
                };
                console.log('payload',payload)
                const initiateResponse = await axios.post(initiateUrl, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Key ${authorizationKey}`,
                    }
                });
                if (initiateResponse.data.pidx) {
                    return res.json(initiateResponse.data.payment_url);
                } else {
                    res.json({ message: 'Payment initiation failed' });
                }
            console.log('validati0n success')
            }else{
                return res.status(400).json({
                    message:'KhaltiValidation Failed',
                    error:JSON.parse(error).error?.msg
                })
            }
            
        }
    } catch (error) {
        // Handle the validation error
        console.error('Error during Khalti validation:', error);

            return res.status(500).json({
                msg: 'An unexpected error occurred.'
            });
        }
}



// for khaltipayment verifications
async function verifyKhaltiPayment(req,res){
  const {pidx,amount,purchase_order_id,purchase_order_name,transaction_id}=req.query;
  const verificationResponse = await axios.post(
    verificationUrl,
    { pidx },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${authorizationKey}`
      }
    }
  );
  if(verificationResponse.data.status==='Completed')
  {
    for(const data of purchase_order_id)
    {
        const found = await cartModel.findOne({productId:data})
        console.log(found)
        if(!found)
        {
            return res.status(400).json({msg:"Data not found "})
        };
        const orderId = (await generateOrderID());
        const createOrder = await orderModel.create({...found,orderId})
        if(!createOrder)
        {
            return res.status(400).json({msg:"Error saving into database"});
        }
        const deleteCartData = await cartModel.findOneAndDelete({productId:data});
        if(!deleteCartData)
        {
            return res.status(400).json({msg:"Data could not be deleted "})
        }
    }
    return res.json('hello success');
  }
}
   
// to find all product 
async function findAllSalesProduct(req,res,next){
    let condition = {};
    try {
     const existingSalesData = await khaltipayment_query.findAll(condition)  
    
     return res.status(200).json({
        data:existingSalesData
     })
    } catch (error) {
      next(error)  
    }
}

module.exports ={
findAllSalesProduct,
khaltiPayment,
verifyKhaltiPayment
}