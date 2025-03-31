const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controller/user/User.controller");

router.post("/register", CONTROLLER.signup);
router.post("/login", CONTROLLER.signin);
router.get("/all", CONTROLLER.getAllUsers);
router.put("/update-profile", CONTROLLER.updateProfile);
router.post('/logout', CONTROLLER.signout);



module.exports = router