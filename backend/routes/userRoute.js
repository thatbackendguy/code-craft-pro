const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createUser, loginUser, logout } = require("../controller/userCtrl");
const {
	resetPassword,
	forgotPasswordToken,
	deleteUser,
    updateUserPassword,
	otpVerification,
} = require("../controller/userCtrl");

//initializing router
const router = express.Router();

// Routes
router.post("/signup",createUser);
router.post("/login",loginUser);
router.get("/logout",logout);
router.post("/otp-verification",otpVerification)
router.put("/reset-password/:token", resetPassword);
router.delete("/delete", deleteUser);
router.post("/forgot-password-token", authMiddleware, forgotPasswordToken);
router.put("/update-password", authMiddleware, updateUserPassword);



module.exports = router;
