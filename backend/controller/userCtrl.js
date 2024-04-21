const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const { sendEmail } = require("./emailCtrl");

// importing models
const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");

// function to generate OTPs
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
				const payload = `<table class="body-wrap" style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important;">
				<tbody>
				  <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
					<td class="container" style="margin: 0 auto !important; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; display: block !important; clear: both !important; max-width: 580px !important;"><!-- Message start -->
					  <table style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; border-collapse: collapse; width: 100%; height: 200px;">
						<tbody>
						  <tr style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; height: 136px;">
							<td class="masthead" style="margin: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; background: #030014; color: white; height: 136px;" align="center">
							  <h1>👨🏻‍💻 CodeCraftPro.</h1>
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

			} catch (error) {
				throw new Error(error);
			}

			res.status(201).json({
				userID: newUser._id,
				status: "success",
				message: "New user successfully created!"
			});

		} catch (error) {
			res.status(500).json({
				status: "error",
				message: error
			});
		}
	} else {
		res.status(409).json({
			status: "error",
			message: "Duplicate Email Found! User already exists!"
		});
	}
});

// login
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// check if user exists or not
	const findUser = await User.findOne({ email });
	if (findUser) {
		if (await findUser.isPasswordMatched(password)) {
			const refreshToken = await generateRefreshToken(findUser?._id);
			await User.findByIdAndUpdate(
				findUser.id,
				{
					refreshToken: refreshToken,
				},
				{ new: true }
			);

			res.status(201).cookie("refreshToken", refreshToken, {
				httpOnly: true,
				maxAge: 72 * 60 * 60 * 1000, // 72 hours or 3 days
			});

			res.status(200).json({
				_id: findUser?._id,
				name: findUser?.name,
				token: generateToken(findUser?._id),
				status: "success",
			});
		} else {
			res.status(401).json({
				status: "error",
				message: "Invalid Credentials!"
			});
		}
	}
	else {
		res.status(404).json({
			status: "error",
			message: "User not found!"
		});
	}
});

// otp verification
const otpVerification = asyncHandler(async (req, res) => {

	try {
		validateMongoDbId(req.body.userID);
		const user = await User.findById(req.body.userID)
		if (user.otp.toString() === req.body.otp.toString()) {
			user.isVerfied = true
			user.otp = ""

			await user.save()

			res.status(200).json({
				status: "success",
				message: "OTP Verified!"
			})
		} else {
			res.status(401).json({
				status: "error",
				message: "OTP Invalid!"
			})
		}

	} catch (e) {
		res.status(500).json({
			status: "error",
			message: e
		})
	}

})


// get user profile details
const getUserProfile = asyncHandler(async (req, res) => {
	let totalLoc = 0;

	const userID = req.params.userID;

	validateMongoDbId(userID);
	try {

		const currUser = await User.findById(userID, { username: 1, name: 1, _id: 0 });

		const workspaceCount = await Workspace.countDocuments({ owner: userID })

		const folders = await Folder.find({ owner: userID },{files:1,name:1,_id:0})

		const files = await File.find({ owner: userID })

		const fileCount = files.length;

		const folderCount = folders.length;

		let lines = {};

		if (fileCount > 0) {
			files.forEach(file => {
				totalLoc += (file.data?.split("\n")).length;
				const lineCount = (file.data?.split("\n")).length;
				lines[file.name] = lineCount;
			});
		}

		res.status(200).json({
			status: "success",
			"user": currUser,
			workspaceCount,
			folderCount,
			fileCount,
			totalLoc,
			lines,
			folders
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			status: "error",
			message: error
		})
	}
})

module.exports = {
	createUser,
	loginUser,
	otpVerification,
	getUserProfile
};
