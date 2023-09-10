const router = require('express').Router();

const subscriptionController = require('../../controller/subscription/subscription');

router.route('/createSubscription').post(subscriptionController.createSubscription);
router.route('/').get(subscriptionController.AllSubscriptionSchems);
router.route('')
