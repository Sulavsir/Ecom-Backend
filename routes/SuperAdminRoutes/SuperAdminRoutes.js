const router = require('express').Router();
const upload = require('../../helper/uploadImage');
const superAdminAPI = require('../../controller/SuperAdmin/SuperAdminController');






router.route('/register')
.post(upload.single("photo"),superAdminAPI.superAdminRegister)
// .get(superAdminAPI.verification);
// .delete('/')
router.route('/verify/:verificationToken').get(superAdminAPI.verification);
router.route('/login').get(superAdminAPI.SuperAdminLogin);
router.route('/updateProfilepic').put(upload.single("photo"),superAdminAPI.UpdateSuperAdminProfilepic);

module.exports = router;