const express = require("express");
const router = express.Router();
const controller = require("../controllers/blogs");
const checkAuth = require('../middlewares/check-auth');

/* GET blogs. */
router.get("/",   controller.get_blogs);

/* GET custom blog. */
router.get("/",controller.get_blog);

/* POST Create blog */
router.post("/" , controller.create_blog);

/* Update custom blog */
router.patch("/" , controller.update_blog);

/* DELETE custom blog */
router.delete("/" , controller.delete_blog);

module.exports = router;
