const router = require('express').Router();
const upload = require('../../helper/uploadImage')
const customerAPI = require('../../controller/customer/customer');
router.route('/register')
.post(upload.single("photo"),customerAPI.customerRegister)
// .delete('/')
router.route('/verify/:verificationToken').get(customerAPI.verification);
router.route('/login').get(customerAPI.customerLogin);
router.route('/updateImage').put(upload.single("photo"),customerAPI.UpdateCustomerProfilepic);
router.route('/delete-many').delete(customerAPI.deleteMany);
router.route('/delete-permanent').delete(customerAPI.deletePermanent);
module.exports = router;