const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createUser,
	loginUser,
	logout,
	otpVerification,
	// resetPassword,
	// forgotPasswordToken,
	// deleteUser,
    // updateUserPassword,
	getUserProfile
	 } = require("../controller/userCtrl");

//initializing router
const router = express.Router();

// Routes
router.post("/signup",createUser);
router.post("/login",loginUser);
router.get("/logout",logout);
router.post("/otp-verification",otpVerification)
router.get("/profile/:userID",getUserProfile)




module.exports = router;
