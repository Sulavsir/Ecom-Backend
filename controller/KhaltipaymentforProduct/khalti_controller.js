const khaltipayment_query = require('./khalti_product_query');
const Client = require('../../models/customer/customerModel');
const {generateOrderID} = require('../../helper/generate_orderid');
const axios = require('axios');
const KhaltiValidation= require('../../helper/validateKhaltidata');
const cartModel = require('../../models/Cart/cartModel');
const orderModel = require('../../models/order/orderModel')


// for khalti 
const initiateUrl = "https://a.khalti.com/api/v2/epayment/initiate/";
const verificationUrl = 'https://a.khalti.com/api/v2/epayment/lookup/';
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
              console.log("first---->",khaltivalidation.calculatedKhaltiData)
              let singleString ='';
              for (const productId of khaltivalidation.calculatedKhaltiData){
                 console.log("identity ",productId.identity)
                 singleString = singleString.concat(productId.identity,',');
                
              }
              if (singleString.endsWith(',')) {
                singleString = singleString.slice(0, -1);
            }
              console.log("singlrString",singleString)
                const client = await Client.findOne({ _id: '6517112bf171e224f0bb79a4' });
        
                if (!client) {
                    return res.status(404).json({
                        msg: 'You are unauthorized'
                    });
                }
                   const payload = {
                    "return_url": `https://localhost:7000/api/sales/payment/success/${singleString}`,
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
    let PuchaseDetails=[];
    const {pidx,amount,purchase_order_id,purchase_order_name,transaction_id}=req.query;
    const data = req.params;
    console.log("data--->",data)
    const ProductId = data.data.split(',')
    console.log("productId ",ProductId)
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
 
  console.log('hello 92')
  if(verificationResponse.data.status==='Completed'){
    for(const productId  of ProductId ){
        const CartData = await CartModel.findOne({productId:productId})
        
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