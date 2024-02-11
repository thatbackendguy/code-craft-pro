const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");

var userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},

		mobile: {
			type: String,
			required: true,
			unique: true,
		},

		password: {
			type: String,
			required: true,
		},

		refreshToken: {
			type: String,
		},

		passwordChangedAt: {
			type: Date,
		},

		passwordResetToken: {
			type: String,
		},

		passwordResetExpires: {
			type: Date,
		},

		isVerfied: {
			type: Boolean,
			default: false,
		},

		workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],
    	
		sharedWithMe: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }],

		otp: { type: String },

		isOnline: { type: Boolean },

	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSaltSync(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
	const resettoken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resettoken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
	return resettoken;
};

module.exports = mongoose.model("User", userSchema);
