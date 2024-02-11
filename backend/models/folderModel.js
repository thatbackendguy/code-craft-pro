import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a folder name"],
        unique: true,
    },

    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
},{ timestamps: true })

const Folder = mongoose.models.workspace || mongoose.model("folder", folderSchema);

export default Folder;