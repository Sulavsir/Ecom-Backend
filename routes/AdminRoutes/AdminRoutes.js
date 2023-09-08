const router = require("express").Router();
const AdminAPI = require('../../controller/Admin/AdminController');
router.route('/register')
.post(AdminAPI.AdminRegister)
// .get(AdminAPI.verification);
// .delete('/')
router.route('/verify/:verificationToken').get(AdminAPI.verification);
router.route('/login').get(AdminAPI.AdminLogin);

module.exports = router;