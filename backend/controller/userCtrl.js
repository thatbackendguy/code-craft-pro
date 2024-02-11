const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const CryptoJS = require("crypto-js");

const User = require("../models/userModel");

const { sendEmail } = require("./emailCtrl");

function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000);
}

// signup - create user
const createUser = asyncHandler(async (req, res) => {
	
	const newUserData = {
		name: req.body.name,
		username: req.body.username,
		mobile: req.body.mobile,
		email: req.body.email,
		password: req.body.password,
		otp: generateOTP(),
	}

	// checking if user exists or not
	const findUser = await User.findOne({ email: newUserData.email });

	if (!findUser) {
		try {
			// Insert user into database
			const newUser = await User.create(newUserData);
			
			// Email for OTP verification
			try {
				const name = newUser.name;
				const payload = `<table class="body-wrap" style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important;">
				<tbody>
				  <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
					<td class="container" style="margin: 0 auto !important; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; display: block !important; clear: both !important; max-width: 580px !important;"><!-- Message start -->
					  <table style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; border-collapse: collapse; width: 100%; height: 200px;">
						<tbody>
						  <tr style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; height: 136px;">
							<td class="masthead" style="margin: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; background: #030014; color: white; height: 136px;" align="center">
							  <h1>💻 CodeCraftPro.</h1>
							</td>
						  </tr>
						  <tr style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; height: 473px;">
							<td class="content" style="margin: 0px; padding: 30px 35px; font-size: 100%; line-height: 1.65; background: #030014; height: 473px;">
							  <h2 style="font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; margin: 0px 0px 20px; padding: 0px; font-size: 28px; line-height: 1.25;">
								<span style="color: #b6b2ff;">Hi ${newUser.name} 👋,</span>
							  </h2>
							  <p>
								<span style="color: #b6b2ff;">Thank you for signing up with us!😃 We're excited to have you as a part of our community.&nbsp; 
								  <br>
								  <br>By verifying your email, you'll gain full access to all the features and benefits of CodeCraftPro 🚀. If you did not create an account with us, please disregard this email. 
								  <br>
								</span>
							  </p>
							  <table style="font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; line-height: 1.65; border-collapse: collapse; width: 98.2353%; height: 35px;">
								<tbody>
								  <tr style="margin: 0px; padding: 0px; font-size: 100%; line-height: 1.65;">
									<td style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;" align="center">
									  <p style="margin: 0px 0px 20px; padding: 0px; font-size: 16px; line-height: 1.65;">
										<a href="{{ .ConfirmationURL }}" class="button" style="margin: 0px; padding: 0px; font-size: 100%; line-height: 1.65; color: white; display: inline-block; background: #7000FF; border-style: solid; border-color: #7000FF; border-image: initial; border-width: 10px 20px 8px; font-weight: bold; border-radius: 4px;">${newUser.otp}</a>
									  </p>
									</td>
								  </tr>
								</tbody>
							  </table>
							  <p style="font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; margin: 0px 0px 20px; padding: 0px; font-size: 16px; line-height: 1.65; font-weight: normal;">
								<span style="color: #b6b2ff;">
								  <em style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">– Team CodeCraftPro.</em>
								</span>
							  </p>
							</td>
						  </tr>
						</tbody>
					  </table>
					</td>
				  </tr>
				  <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
					<td class="container" style="margin: 0 auto !important; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; display: block !important; clear: both !important; max-width: 580px !important;">
					  <span style="color: #b6b2ff;"><!-- Message start --></span>
					  <table style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; border-collapse: collapse; width: 100% !important;">
						<tbody>
						  <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
							<td class="content footer" style="margin: 0; padding: 30px 35px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; background: none;" align="center">&copy; CodeCraftPro, 2023</td>
						  </tr>
						</tbody>
					  </table>
					</td>
				  </tr>
				</tbody>
			  </table>`;
				const data = {
					to: newUser.email,
					text: `Hey ${newUser.name}`,
					subject: "OTP for User Verification",
					htm: payload,
				};

				sendEmail(data);

				res.json({
					userID: newUser._id,
					status: "Success",
					message: "New user successfully created!"
				});
			} catch (error) {
				throw new Error(error);
			}

			// return response
			res.json(newUser);
		} catch (error) {
			throw new Error(error);
		}
	} else {
		res.json({
			status: "Error",
			message: "Duplicate Email Found! User already exists!"
		});
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
		res.json({
			status: "Error",
			message: "Invalid Credentials!"
		});
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

// otp verification
const otpVerification = asyncHandler(async (req, res) => {
	
	try {
		validateMongoDbId(req.body.userID);
		const user = await User.findById(req.body.userID)
		if(user.otp.toString() === req.body.otp.toString()) {
			user.isVerfied = true
			user.otp = ""
			const updatedUser = await user.save()

			res.json({
				status: "Success",
				message: "OTP Verified!"
			})
		} else {
			res.json({
				status: "Error",
				message: "OTP Invalid!"
			})
		}

	} catch(e) {
		res.json({
			status: "Error",
			message: e
		})
	}

})

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

module.exports = {
	createUser,
	loginUser,
	logout,
	updateUserPassword,
	forgotPasswordToken,
	resetPassword,
	deleteUser,
	addPassword,
	getUserPasswords,
	deletePassword,
	otpVerification
};
