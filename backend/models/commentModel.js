const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        fileID: { type: mongoose.Schema.Types.ObjectId, ref: "File" },

        message: { type: String },
    },
    { timestamps: true }
);

const Comment = mongoose.models.comment || mongoose.model("comment", commentSchema);

module.exports = mongoose.model("Comment", commentSchema);