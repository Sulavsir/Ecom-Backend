const khaltipayment_query = require('./khalti_product_query')
const ProductSchema = require('../../controller/products/productquery')
const Client = require('../../models/customer/customerModel')
const {generateOrderID} = require('../../helper/generate_orderid')
const axios = require('axios');
const KhaltiValidation= require('../../helper/validateKhaltidata')

// for khalti 
const initiateUrl = "https://a.khalti.com/api/v2/epayment/initiate/"
const verificationUrl = 'https://a.khalti.com/api/v2/epayment/lookup/'
const authorizationKey = process.env.KhaltiAuth_KEY;

async function khaltiPayment(req, res, next) {
    const data = req.body;
    const orderId = (await generateOrderID()).toString();
    const cacheTimeout =36000;

    try {
        
        const khaltivalidation = await KhaltiValidation(data)
        console.log(typeof(khaltivalidation))
        if(typeof(khaltivalidation)==='object'){
            const error = JSON.stringify(khaltivalidation)
            if(!JSON.parse(error).error?.msg){
                console.log('---------->',khaltivalidation.calculatedKhaltiData)
                // Your validation was successful, continue with the payment initiation logic
              const khalti = khaltivalidation.calculatedKhaltiData
                const client = await Client.findOne({ _id: '6517112bf171e224f0bb79a4' });
        
                if (!client) {
                    return res.status(404).json({
                        msg: 'You are unauthorized'
                    });
                }
                   const payload = {
                    "return_url": `https://api.koseli.app/api/khalti/payment/success/`,
                    "website_url": data.website_url,
                    "amount": khaltivalidation.totalAmount * 100,
                    "purchase_order_id": orderId,
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
                        Authorization: `Key ${authorizationKey}`
                    }
                });
        
                console.log('initiateResponse',initiateResponse)
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
khaltiPayment
}