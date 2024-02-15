const router = require('express').Router()
const cartController = require('../../controller/cartController/cartController')
const Authentication = require('../../helper/authenctication')


router.post('/',Authentication,cartController.addToCart)
router.put('/',Authentication,cartController.updateCart)
router.get('/',Authentication,cartController.displaySpecificCart)
router.delete('/',Authentication,cartController.deleteUsersData)

module.exports = router;
