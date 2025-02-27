const express = require("express");
const router = express.Router();
const controller = require("../controllers/products");
const checkAuth = require('../middlewares/check-auth');

/* GET products. */
router.get("/", controller.get_products);

/* GET custom product. */
router.get("/:id",controller.get_product);

/* POST Create product */
router.post("/" , controller.create_product);

/* Update custom product */
router.patch("/:id" ,controller.update_product);

/* DELETE custom product */
router.delete("/:id" ,controller.delete_product);

module.exports = router;
