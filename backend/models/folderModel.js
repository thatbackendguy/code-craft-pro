
const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a folder name"],
    },

    files: [{ _id: 
        {type: mongoose.Schema.Types.ObjectId, ref: "File" },
        name: {type: String}
    }],

    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
},{ timestamps: true })

// const Folder = mongoose.models.workspace || mongoose.model("folder", folderSchema);

module.exports = mongoose.model("Folder", folderSchema);