const router = require("express").Router();
const upload = require('../../helper/uploadImage');
const AdminAPI = require('../../controller/Admin/AdminController');



router.route('/register').post(upload.single("photo"),AdminAPI.AdminRegister)
// .get(AdminAPI.verification);
// .delete('/')
router.route('/verify/:verificationToken').get(AdminAPI.verification);
router.route('/login').post(AdminAPI.AdminLogin);
router.route('/updateProfilePic').put(upload.single("photo"),AdminAPI.UpdateAdminProfilepic);
router.route('/delete-many').delete(AdminAPI.deleteMany);
router.route('/delete-permanent').delete(AdminAPI.deletePermanent);
router.route('/verifiedAdmins').get(AdminAPI.allverifedAdmin);
router.route('/UnverifiedAdmins').get(AdminAPI.allUnverifedAdmin);

module.exports = router;