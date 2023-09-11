const router = require("express").Router();
const Tax = require('../../controller/taxController/taxController');

router.get('/All',Tax.AllTax);
router.post('/create',Tax.createTax);
router.put('/update/:id',Tax.updateTax);
router.get('/search',Tax.searchTax);
router.delete('/delete/:id',Tax.deleteTax);

module.exports = router;