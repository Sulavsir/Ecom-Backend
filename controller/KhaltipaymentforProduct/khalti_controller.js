const Client = require('../../models/customer/customerModel');
const {generateOrderID} = require('../../helper/generate_orderid');
const axios = require('axios');
const KhaltiValidation= require('../../helper/validateKhaltidata');
const CartModel = require('../../models/Cart/cartModel');
const orderModel = require('../../models/order/orderModel');


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
                const client = await Client.findOne({ _id:'6517112bf171e224f0bb79a4'});
                if (!client) {
                    return res.status(404).json({
                        msg: 'You are unauthorized'
                    });
                }
                const clientId=client._id;
                   const payload = {
                    "return_url": `https://localhost:7000/api/sales/payment/success/${singleString}/${clientId}`,
                    "website_url": data.website_url,
                    "amount": khaltivalidation.totalAmount * 100,
                    "purchase_order_id":`${singleString}`,
                    "purchase_order_name": "test2",  
                    "product_details":khalti, 
                    "customer_info": {
                        "name": client.name,
                        "email": client.email,
                    }
                };
                console.log('payload',payload)
                const initiateResponse = await axios.post(initiateUrl, payload,{
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
    const orderId =  (await generateOrderID()).toString();
    const {pidx}=req.query;
    let PurchaseOrders=[];
    const {data,clientId} = req.params;
    const ProductId = data.split(',')
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
 // extract transaction id and total amount form khalti response
  const transactionId=verificationResponse.data.transaction_id;
  const totalAmount=verificationResponse.data.total_amount/100;
  if(verificationResponse.data.status==='Completed'){
    for(const productId  of ProductId ){
        const CartData = await CartModel.findOne({productId:productId})
        PurchaseOrders.push(CartData)
      }
    
  }
  const newOrderData = await orderModel.create({productDetails:PurchaseOrders,orderId:orderId, clientId:clientId,
    transaction_id:transactionId,
    total_amount:totalAmount 
   });

  if(newOrderData){
    return res.status(200).json({
        msg:"Thank you for payment via khalti",
    });
  }
  return res.status(400).json({
    msg:"encountering error while payment via khalti"
  })
}
   
// to find all product 
async function findAllSalesProduct(req,res,next){
    const {status} = req.body;
    const clientId = '6517112bf171e224f0bb79a4';
    let arr = [];
    try {
     const existingSalesData = await orderModel.find({clientId:clientId})
     console.log(existingSalesData)
     for(const data of existingSalesData)
     {
       const pdDetails = data.productDetails.find(element => element.status === status)
      //  console.log(data)
       if(!pdDetails)
       {
        return res.status(400).json({
          msg:"No data found "
        })
        
       }
       const orderDetails ={
          clientId:clientId,
          orderId:data.orderId,
          pdDetails:pdDetails
       };
       arr.push(orderDetails);    
       return res.status(200).json({ orderDetails : arr})
     }

     return res.status(200).json({
        data:existingSalesData
     })
    } catch (error) {
      next(error)  
    }
}

// function for update 
async function updateOrder(req,res){
  try {
  const {orderId,_id,status} = req.body;
  const foundOrder = await orderModel.findOne({orderId:orderId});
  const prdcts = foundOrder.productDetails.find(element=>element._id.toString()===_id)

  if(req.user.role ==='CLIENT')
  {
    if(prdcts.status==='pending')
    {
      prdcts.status = "cancelByUser"; 
      await foundOrder.save();
    }
    else
    {
      return res.status(400).json({ msg: "You can only cancel pending orders." });
    }    
  }
  
  if(req.user.role ==='ADMIN')
  {
    if(prdcts.status==='pending')
  {
       prdcts.status="cancelByUser";

  }
  }
  console.log(prdcts);
  res.json(foundOrder);
  } catch (error) {
    return res.status(501).json({msg:"Internal Server Error"})
  }
}

module.exports ={
findAllSalesProduct,
khaltiPayment,
verifyKhaltiPayment,
updateOrder
}