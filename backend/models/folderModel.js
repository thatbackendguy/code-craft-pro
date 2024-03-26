
const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a folder name"],
    },

    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],

    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

},{ timestamps: true })

module.exports = mongoose.model("Folder", folderSchema);