const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Intermediation.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.createIntermediation); // ✅ Créer une intermédiation
router.get("/all", verifyToken, CONTROLLER.getAllIntermediations);// ✅ Voir toutes les demandes (admin uniquement)
router.get("/user", verifyToken, CONTROLLER.getUserIntermediations); // ✅ Récupérer les demandes de l'utilisateur
router.get("/get/:id", verifyToken, CONTROLLER.getIntermediationById); // ✅ Récupérer une demande spécifique
router.put("/update/:id", verifyToken, CONTROLLER.updateIntermediation); // ✅ Mettre à jour une demande
router.delete("/delete/:id", verifyToken, CONTROLLER.deleteIntermediation); // ✅ Soft delete


module.exports = router;
