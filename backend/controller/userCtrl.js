const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const CryptoJS = require("crypto-js");

const User = require("../models/userModel");

const { sendEmail } = require("./emailCtrl");

// signup - create user
const createUser = asyncHandler(async (req, res) => {
	const email = req.body.email;
	const findUser = await User.findOne({ email: email });

	if (!findUser) {
		try {
			const newUser = await User.create(req.body);
			res.json(newUser);
		} catch (error) {
			throw new Error(error);
		}
	} else {
		throw new Error("User Already Exists");
	}
});

// login
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check if user exists or not
	const findUser = await User.findOne({ email });
	if (findUser && (await findUser.isPasswordMatched(password))) {
		const refreshToken = await generateRefreshToken(findUser?._id);
		const updateuser = await User.findByIdAndUpdate(
			findUser.id,
			{
				refreshToken: refreshToken,
			},
			{ new: true }
		);

		
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			maxAge: 72 * 60 * 60 * 1000,
		});
		res.json({
			_id: findUser?._id,
			username: findUser?.username,
			email: findUser?.email,
			token: generateToken(findUser?._id),
			status: "Success",
		});
	} else {
		throw new Error("Invalid Credentials");
	}
});

// logout
const logout = asyncHandler(async (req, res) => {
	const cookie = req.cookies;
	const refreshToken = cookie?.refreshToken;
	if (!refreshToken) throw new Error("No Refresh Token in Cookies");
	const user = await User.findOne({ refreshToken });
	if (!user) {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: true,
		});
		return res.json({
			message:"Logout Successful!"
		});; // forbidden
	}
	await User.findOneAndUpdate({refreshToken}, {
		refreshToken: "",
	});
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: true,
	});
	res.json({
		message:"Logout Successful!"
	}); // forbidden
});

// update password
const updateUserPassword = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { password } = req.body;
	validateMongoDbId(_id);
	const user = await User.findById(_id);
	if (password) {
		user.password = password;
		const updatedPassword = await user.save();
		res.json(updatedPassword);
	} else {
		res.json(user);
	}
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongoDbId(_id);
	const user = await User.findById(_id);
	if (!user) {
		throw new Error("User not found with this email");
	} else {
		try {
			const name = user.firstname + user.lastname;
			const token = await user.createPasswordResetToken();
			await user.save();
			const resetURL = `Hi ${name}, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
			const data = {
				to: email,
				text: `Hey ${name}`,
				subject: "Reset Password Link",
				htm: resetURL,
			};
			sendEmail(data);
			res.json(token);
		} catch (error) {
			throw new Error(error);
		}
	}
});

const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body;
	const { token } = req.params;
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user) throw new Error(" Token Expired, Please try again later");
	user.password = password;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const findUser = await User.findOne({ email });
	if (findUser && (await findUser.isPasswordMatched(password))) {
		const deletedUser = await User.findByIdAndDelete(findUser._id);
		res.json({
			message: `${deletedUser.firstname} deleted successfully!`,
		});
	} else {
		res.json({
			message: "Invalid credentials! OR User doesn't exists!",
		});
	}
});

// adding password
const addPassword = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const { _id } = req.user;
	validateMongoDbId(_id);

	const findPass = await Password.findOne({ name, email, owner: _id });
	if (findPass)
		throw new Error(
			"Password already exists! Kindly navigate to update password."
		);
	const newPass = await Password.create({
		name: name,
		email: email,
		password: CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString(),
		owner: _id,
	});
	let user = await User.findByIdAndUpdate(
		_id,
		{
			$push: { user_passwords: newPass._id },
		},
		{
			new: true,
		}
	);
	res.json(newPass);
});

const getUserPasswords = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongoDbId(_id);
	const userPasswords = await User.findById(_id)
		.select("user_passwords")
		.populate("user_passwords");
	res.json(userPasswords);
});

const deletePassword = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { id } = req.params;
	validateMongoDbId(_id);
	try {
		const pass = await Password.findByIdAndDelete(id);
		let user = await User.findByIdAndUpdate(
			_id,
			{
				$pull: { user_passwords: pass._id },
			},
			{
				new: true,
			}
		);
		res.json({
			message: "Password deleted successfully!",
		});
	} catch (error) {
		throw new Error(error);
	}
});

const updatePassword = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { id } = req.params;
	const { name, email, password } = req.body;
	validateMongoDbId(_id);

	try {
		const updatePass = await Password.findByIdAndUpdate(
			id,
			{
				name,
				email,
				password: CryptoJS.AES.encrypt(
					password,
					process.env.AES_SECRET
				).toString(),
			},
			{
				new: true,
			}
		);
		res.json({
			message: "Password updated successfully!",
		});
	} catch (error) {
		throw new Error(error);
	}
});

const getDecryptedPass = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongoDbId(_id);
	const { id } = req.params;
	try {
		var pass;
		const user = await User.findById({ _id });
		if (!user) throw new Error("No user found, please login again!");
		const passwordIds = user.user_passwords;
		for (let i = 0; i < passwordIds.length; i++) {
			if (id == passwordIds[i]) {
				pass = await Password.findById(id);
				break;
			}
		}
		if (pass === undefined) {
			res.json({
				message: "Password not found!",
			});
		} else {
			res.json({
				name: pass.name,
				email: pass.email,
				password: CryptoJS.AES.decrypt(
					pass.password,
					process.env.AES_SECRET
				).toString(CryptoJS.enc.Utf8),
				owner: `${user.firstname} ${user.lastname}`,
				"owner-email": user.email,
			});
		}
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	createUser,
	loginUser,
	logout,
	updateUserPassword,
	updatePassword,
	forgotPasswordToken,
	resetPassword,
	deleteUser,
	addPassword,
	getUserPasswords,
	deletePassword,
	getDecryptedPass,
};
