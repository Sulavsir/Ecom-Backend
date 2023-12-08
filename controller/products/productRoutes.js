const router = require('express').Router();
const ItemCtrl = require('./productController');
const uploader = require('../../helper/uploadImage')
const authenticate = require('../../helper/authenctication')
const isCustomer = require('../../helper/isCustomer')
const adminAuthenticate  = require('../../helper/adminAuthenticate');


router.route('/search')
  .get(ItemCtrl.search)

router.route('/')
  .get(
    authenticate, 
    ItemCtrl.getAllItem)
  .post(
    // authenticate,
    // adminAuthenticate,
     uploader.array('images'), ItemCtrl.insert)
   .delete(
    ItemCtrl.removeAllItems
   );


router.route('/add_ratings/:item_id')
  .post(
    authenticate,
    uploader.array('image',3),
     ItemCtrl.addRatings)

router.route('/:id')
  .get( ItemCtrl.getById)
  .put( authenticate,
    adminAuthenticate,
    uploader.array('images'), ItemCtrl.update)
  .delete( ItemCtrl.remove);
  //to delete all items 


module.exports = router;
