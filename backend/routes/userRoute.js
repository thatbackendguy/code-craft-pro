const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createUser, loginUser, logout } = require("../controller/userCtrl");
const {
	updatePassword,
	resetPassword,
	forgotPasswordToken,
	deleteUser,
	addPassword,
    getUserPasswords,
    deletePassword,
    updateUserPassword,
    getDecryptedPass
} = require("../controller/userCtrl");

//initializing router
const router = express.Router();

// Routes
router.post("/signup",createUser);
router.post("/login",loginUser);
router.get("/logout",logout);
router.put("/reset-password/:token", resetPassword);
router.delete("/delete", deleteUser);
router.post("/forgot-password-token", authMiddleware, forgotPasswordToken);
router.put("/update-password", authMiddleware, updateUserPassword);
router.post("/password/add", authMiddleware, addPassword);
router.get("/", authMiddleware, getUserPasswords)
router.delete("/password/delete/:id", authMiddleware, deletePassword)
router.put("/password/update/:id", authMiddleware, updatePassword)
router.get("/password/decrypt/:id", authMiddleware, getDecryptedPass)


module.exports = router;
