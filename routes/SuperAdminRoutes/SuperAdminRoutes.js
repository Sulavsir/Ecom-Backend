const router = require('express').Router();
const superAdminAPI = require('../../controller/SuperAdmin/SuperAdminController');
router.route('/register')
.post(superAdminAPI.superAdminRegister)
// .get(superAdminAPI.verification);
// .delete('/')
router.route('/verify/:verificationToken').get(superAdminAPI.verification);
router.route('/login').get(superAdminAPI.SuperAdminLogin);

module.exports = router;