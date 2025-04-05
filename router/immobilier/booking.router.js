const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Booking.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.postBooking);
router.get("/all", verifyToken, CONTROLLER.getAllBookings);// ✅ Récupérer toutes les réservations (admin uniquement)
router.get("/user", verifyToken, CONTROLLER.getUserBookings);
router.put("/delete/:id", verifyToken, CONTROLLER.deleteBooking);
router.put("/update/:id", verifyToken, CONTROLLER.updateBooking);

module.exports = router;
