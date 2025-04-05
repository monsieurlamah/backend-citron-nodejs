const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Appointement.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.postAppointment);
router.put("/delete/:id", verifyToken, CONTROLLER.deleteAppointment);
router.put("/update/:id", verifyToken, CONTROLLER.updateAppointment);
router.get("/user", verifyToken, CONTROLLER.getUserAppointments); // ✅ Voir ses propres rendez-vous
router.get("/all", verifyToken, CONTROLLER.getAllAppointments); // ✅ Voir tous les rendez-vous (admin)

module.exports = router;
