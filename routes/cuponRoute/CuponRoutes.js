const router = require('express').Router();

const Coupon = require('../../controller/cuponController/cuponController');

router.route("/All").get(Coupon.AllCoupons)
router.route("/create").post(Coupon.createCoupon); 
router.delete('/delete-coupon',Coupon.deleteCoupon);
router.put('/update-coupon/:id',Coupon.updateCoupon);

module.exports = router;