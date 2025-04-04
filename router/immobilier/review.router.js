const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Review.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.postReview);
router.get("/all", CONTROLLER.getAllReviews);
router.put("/delete/:id", verifyToken, CONTROLLER.deleteReview);
router.get("/mes-avis", verifyToken, CONTROLLER.getUserReviews); // ✅ Récupérer ses propres avis
router.put("/update/:id", verifyToken, CONTROLLER.updateReview);

module.exports = router;
