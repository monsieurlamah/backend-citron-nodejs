const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Category.controller");

router.post("/add", CONTROLLER.createCategory);
router.get("/all", CONTROLLER.getAllCategories);
router.put("/update/:id", CONTROLLER.updateCategory);
router.put("/delete/:id", CONTROLLER.deleteCategory);
router.get("/category/:id", CONTROLLER.categoryWithProperties);

module.exports = router;
