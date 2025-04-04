const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Property.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.createProperty);
router.get("/all", CONTROLLER.getAllProperties);
router.get("/get/:slug", CONTROLLER.getPropertyBySlug);
router.put("/update/:id", verifyToken, CONTROLLER.updateProperty);
router.put("/delete/:id", verifyToken, CONTROLLER.deleteProperty);

module.exports = router;
