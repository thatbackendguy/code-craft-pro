const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a workspace name"],
    },

    folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

},{ timestamps: true })

const Workspace = mongoose.models.workspace || mongoose.model("workspace", workspaceSchema);

module.exports = mongoose.model("Workspace", workspaceSchema);