const router = require('express').Router()
const cartController = require('../../controller/cartController/cartController')

router.post('/',cartController.addToCart);
router.put('/',cartController.updateCart)

module.exports = router;
