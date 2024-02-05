const router = require("express").Router();
const blogController = require('../../controller/blogController/blogController');
const upload = require("../../helper/uploadImage");

router.post('/create-blog',upload.array('image',9),blogController.create_Blog);
router.get('/All-blogs', blogController.index_Blog);
router.put('/update-blog/:id',upload.array('image',9),blogController.update_Blog);
router.delete('/delete-blogs/:id',blogController.delete_Blogs);
router.get('/search-blog/:id', blogController.search_Blog);

module.exports = router;