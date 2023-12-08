const router = require('express').Router();
const khaltiController = require('./khalti_controller')

router.route('/')
.post(khaltiController.khaltiPayment)
.get(khaltiController.findAllSalesProduct)


module.exports= router