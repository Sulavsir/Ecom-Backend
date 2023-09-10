const router = require("express").Router();
const blogController = require('../../Controller/blogController/blogController');
const upload = require("../../helper/uploadImage");

router.post('/blog/create-blog',upload.array('image',9),blogController.create_Blog);
router.get('/blog/All-blogs', blogController.index_Blog);
router.patch('/blog/update-blog/:id',upload.array('image',9),blogController.update_Blog);
router.delete('/blog/delete-blog/:id',blogController.delete_Blog);
router.get('/blog/search-blog/:id', blogController.search_Blog);

module.exports = router;