const router = require('express').Router();

const subscriptionController = require('../../controller/subscription/subscription');

router.route('/createSubscription').post(subscriptionController.createSubscription);
router.route('/').get(subscriptionController.AllSubscriptionSchems);
router.route('/updateSubscription/:id').put(subscriptionController.updateSubscription);
router.route('/Add-plan/:id').put(subscriptionController.AddPlans);
router.route('/delete/:id').delete(subscriptionController.deleteSubscription);

module.exports = router;
