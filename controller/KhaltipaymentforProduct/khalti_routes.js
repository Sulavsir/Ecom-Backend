const router = require('express').Router();
const khaltiController = require('./khalti_controller');
const authentication = require('../../helper/authenctication');

router.get('/payment/success/:data/:clientId',khaltiController.verifyKhaltiPayment)
router.route('/')
.post(khaltiController.khaltiPayment)
.get(khaltiController.findAllSalesProduct)
.put(authentication,khaltiController.updateOrder);

module.exports= router;