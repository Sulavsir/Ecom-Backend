const router = require('express').Router();
const khaltiController = require('./khalti_controller')

router.get('/payment/success/:data/:clientId',khaltiController.verifyKhaltiPayment)
router.route('/')
.post(khaltiController.khaltiPayment)
.get(khaltiController.findAllSalesProduct)

module.exports= router;