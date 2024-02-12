const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a file name"],
    },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },

    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    
    data: { type: String }
}, { timestamps: true })

const File = mongoose.models.file || mongoose.model("file", fileSchema);
module.exports = mongoose.model("File", fileSchema);