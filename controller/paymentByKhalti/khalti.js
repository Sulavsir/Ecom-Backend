const axios = require('axios');
require('dotenv').config();

const  Subscription = require('../../models/subscription/subscription');
const adminModel = require('../../models/Admin/AdminModel')

const initiateUrl = 'https://a.khalti.com/api/v2/epayment/initiate/';
const verificationUrl = 'https://a.khalti.com/api/v2/epayment/lookup/';
const Khalti_key = process.env.KhaltiAuth_KEY;
const authorizationKey = Khalti_key; // Replace with your actual authorization key

const paymentSubscription = async (req, res) => {
  console.log("i am here")
  try {
    const subscriptionId = req.body.subscriptionId;
    const AdminId = req.body.AdminId;
    const subscription = await Subscription.findById(subscriptionId);
    const subscriber = await adminModel.findOne({AdminId:AdminId});

    //check if susbcriber and subscription are there in database
    if(!subscriber) throw new BadRequestError("the subscriber does not exist");
    if(!subscription) throw new BadRequestError("The subscriptions does not exist");
    
    const plan = subscription.plans.find(plan => plan._id == req.body.planId);
    const price = plan.price*100;
    const initiatePayload= {
    "return_url": `https://localhost:7000/api/khalti/subscriber/payment/success/${AdminId}`,
    "website_url": "https://example.com/",
    "amount":price,
    "purchase_order_id": req.body.planId,
    "purchase_order_name": plan.name,
    }

    const initiateResponse = await axios.post(initiateUrl, initiatePayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${authorizationKey}`
      }
    });
    console.log("working")
    if (initiateResponse.data.pidx) {
    //  return res.redirect(initiateResponse.data.payment_url)
    return res.json(initiateResponse.data.payment_url);
    } else {
      res.json({ message: 'Payment initiation failed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyingPayment = async (req, res) => {
  const AdminId = req.params.AdminId;
  // Handle the payment success callback here
  const pidx = "GqHiqMo8BD67savRfRf6qb"//req.params.pidx;
  const planId = "64fd8d04309784fefb71197c"//req.params.purchase_order_id;
  const subscriber = await adminModel.findOne({AdminId:AdminId});
 
  const subscription = await Subscription.findOne({'plans._id':planId});
  console.log(subscription);
  const plan = subscription.plans.find(plan => plan._id == req.body.planId);
  
  try {
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

    if (verificationResponse.data.status === 'Completed') {
      // Payment verification successful, you can save payment info to database here
      // For example, you can use the Payment model to save payment information
      const updateSubscriberData = async()=>{
        subscriber.planId = planId,
        subscriber.allowcategory = plan.allowcategory,
        subscriber.price = plan.price,
        await subscriber.save();
      }
      await updateSubscriberData();

      res.json({
        message: 'Payment verification successful',
        verificationResponse: verificationResponse.data
      });
    } else {
      res.json({
        message: 'Payment verification failed or pending',
        verificationResponse: verificationResponse.data
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {verifyingPayment, paymentSubscription}