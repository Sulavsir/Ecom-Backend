const router = require('express').Router();
const ItemCtrl = require('./productController');
const uploader = require('../../helper/uploadImage')
const authenticate = require('../../helper/authenctication')

router.route('/')
  .get(
    authenticate, 
    ItemCtrl.getAllItem)
  .post(
    // authenticate,
     uploader.array('images'), ItemCtrl.insert);

router.route('/add_ratings/:item_id')
  .post(
    authenticate,
     ItemCtrl.addRatings)

router.route('/:id')
  .get( ItemCtrl.getById)
  .put( uploader.array('images'), ItemCtrl.update)
  .delete( ItemCtrl.remove);

router.route('/search')
  .get(ItemCtrl.search)
  .post(ItemCtrl.search)


module.exports = router;
