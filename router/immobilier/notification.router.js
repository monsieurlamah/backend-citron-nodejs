const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/immobilier/Notification.controller");
const verifyToken = require("../../middlewares/auth");

router.post("/add", verifyToken, CONTROLLER.createNotification);
router.put("/user/", verifyToken, CONTROLLER.getUserNotifications);
router.put("/delete/:id", verifyToken, CONTROLLER.deleteNotification);
router.put("/update/:id", verifyToken, CONTROLLER.updateNotification);

module.exports = router;
