const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Review.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.postReview);
router.put("/delete/:id", verifyToken, CONTROLLER.deleteReview);
router.put("/update/:id", verifyToken, CONTROLLER.updateReview);

module.exports = router;
