const router = require('express').Router();
const { route } = require('../products/productRoutes');
const CategoryController = require('./categories_controller')

router.route('/')
.post(CategoryController.insertion)
.delete(CategoryController.removeMultipleCategories)


module.exports = router;