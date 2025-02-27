const express = require("express");
const router = express.Router();
const controller = require("../controllers/blogs");
const checkAuth = require('../middlewares/check-auth');

/* GET blogs. */
router.get("/", checkAuth,   controller.get_blogs);

/* GET custom blog. */
router.get("/:id",checkAuth, controller.get_blog);

/* POST Create blog */
router.post("/" , checkAuth, controller.create_blog);

/* Update custom blog */
router.patch("/:id" ,checkAuth,  controller.update_blog);

/* DELETE custom blog */
router.delete("/:id" , checkAuth, controller.delete_blog);

module.exports = router;
