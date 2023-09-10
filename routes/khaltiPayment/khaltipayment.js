const router = require('express').Router();

const khaltiController  = require('../../controller/paymentByKhalti/khalti');


router.route("/initiate-payment").post(khaltiController.paymentSubscription);
router.route('/payment/success/:AdminId').get(khaltiController.verifyingPayment);


module.exports =router;