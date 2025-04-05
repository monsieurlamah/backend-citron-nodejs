const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Payment.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/", verifyToken, CONTROLLER.createPayment); // ✅ Enregistrer un paiement
router.put("/:paymentId/status", verifyToken, CONTROLLER.updatePaymentStatus); // ✅ Mettre à jour un paiement
router.get("/user/:utilisateur_id", verifyToken, CONTROLLER.getUserPayments); // ✅ Récupérer les paiements d’un utilisateur
router.get("/booking/:reservation_id",verifyToken,  CONTROLLER.getBookingPayments); // ✅ Récupérer les paiements d’une réservation
router.delete("/:paymentId", verifyToken, CONTROLLER.deletePayment); // ✅ Soft delete d’un paiement

module.exports = router;
