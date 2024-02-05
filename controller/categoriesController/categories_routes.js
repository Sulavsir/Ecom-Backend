const router = require('express').Router();
const { route } = require('../products/productRoutes');
const CategoryController = require('./categories_controller')

router.route('/')
.post(CategoryController.insertion)
.put(CategoryController.updateCategory)
.patch(CategoryController.updateSubcategory)
.delete(CategoryController.removeMultipleCategories)

router.route('/delete')
.delete(CategoryController.removeSubcategory)
module.exports = router;