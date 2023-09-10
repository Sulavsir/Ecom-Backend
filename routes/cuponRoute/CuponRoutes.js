const router = require('express').Router();

const Coupon = require('../../../Controllers/System/cuponController/cuponController');

router.route("/All").get(Coupon.AllCoupons)
router.route("/create").post(Coupon.createCupon); 
router.delete('/delete-coupon/:id',Coupon.deleteCupon);
router.patch('/update-coupon/:id',Coupon.updateCupon);
router.get('/organizerCoupons/:id',Coupon.getCouponByOrganizer);

module.exports = router;