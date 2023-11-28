const router = require('express').Router();
const { route } = require('../products/productRoutes');
const CategoryController = require('./categories_controller')

router.route('/')
.post(CategoryController.insertion)


module.exports = router;