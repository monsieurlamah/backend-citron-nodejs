const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Wishlist.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.addToWishlist); // ✅ Ajouter une propriété aux favoris
router.get("/all", verifyToken, CONTROLLER.getActiveWishlist); // ✅ Récupérer les favoris actifs
router.get("/user", verifyToken, CONTROLLER.getUserWishlist); // ✅ Récupérer les favoris de l'utilisateur connecté
router.delete("/delete/:id", verifyToken, CONTROLLER.deleteWishlistItem); // ✅ Supprimer un favori (soft delete)

module.exports = router;
