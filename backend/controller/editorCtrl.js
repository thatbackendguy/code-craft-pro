const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

const getEditor = asyncHandler(async (req, res) => {
    const { workspaceID, folderID, fileID } = req.params;

    res.json({
        workspaceID, folderID, fileID
    })
})

// Add Workspace - POST
const addWorkspace = asyncHandler(async (req, res) => {
    const userID = req.body.userID;
    const name = req.body.name;

    validateMongoDbId(userID);

    const findWorkspace = await Workspace.findOne({ name: name, owner: userID });

    if (!findWorkspace) {
        try {
            const newWorkspace = await Workspace.create({
                name: name,
                owner: userID
            });
            const workspaceID = await newWorkspace.id
            let user = await User.findOneAndUpdate(
                { _id: userID },
                {
                    $push: { workspaces: workspaceID }
                },
                {
                    new: true
                }
            )

            //console.log(user);

            //console.log(newWorkspace)

            res.json({
                status: "Success",
                message: name+ " workspace created successfully!"
            })
        } catch (error) {
            console.log(error);
            res.json({
                status: "Error",
                message: error
            })
        }
    }
})

// Get Workspaces by User ID - GET
const getWorkspacesByUserID = asyncHandler(async (req, res) => {
    const userID = req.params.userID;
    try {
        const userWorkspaces = await Workspace.find({ owner: userID })

        //console.log(userWorkspaces)

        res.json({
            userWorkspaces
        })
    } catch (error) {
        console.log(error);

        res.json({
            status: "Error",
            message: error
        })
    }
})

// Delete workspace - DELETE
const deleteWorkspace = asyncHandler(async (req, res) => {
    const workspaceID = req.params.id;

    validateMongoDbId(workspaceID)

    try {
        const deletedWorkspace = await Workspace.findOneAndDelete({ _id: workspaceID })

        const user = await User.findByIdAndUpdate(
            { _id: deletedWorkspace.owner },
            {
                $pull:
                {
                    workspaces: workspaceID
                }
            },
            {
                new: true,
            }
        )

        res.json({
            status: "Success",
            message: deletedWorkspace.name+" workspace deleted successfully!"
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: "Error",
            message: error
        })
    }
})

// Add Folder - POST
const addFolder = asyncHandler(async (req, res) => {
    const userID = req.body.userID;
    const folderName = req.body.name;
    const workspaceID = req.params.workspaceID;

    validateMongoDbId(userID);
    validateMongoDbId(workspaceID);

    const findWorkspace = await Workspace.findOne({_id: workspaceID})
    const findFolder = await Folder.findOne({ name: folderName, owner: userID, workspace: workspaceID });

    if (!findFolder && findWorkspace) {
        try {
            const newFolder = await Folder.create({
                name: folderName,
                owner: userID,
                workspace: workspaceID
            });

            let workspace = await Workspace.findOneAndUpdate(
                { _id: workspaceID },
                {
                    $push: { folders: newFolder._id }
                },
                {
                    new: true
                }
            )

            //console.log(workspace);

            //console.log(newFolder)

            res.json({
                status: "Success",
                message: folderName+" folder created successfully!"
            })
        } catch (error) {
            console.log(error);
            res.json({
                status: "Error",
                message: error
            })
        }
    }
})

// Delete Folder - DELETE
const deleteFolder = asyncHandler(async (req, res) => {
    const folderID = req.params.folderID
    
    validateMongoDbId(folderID);

    try {
        const deletedFolder = await Folder.findOneAndDelete({ _id: folderID })

        const workspace = await Workspace.findByIdAndUpdate(
            { _id: deletedFolder.workspace },
            {
                $pull:
                {
                    folders: folderID
                }
            },
            {
                new: true,
            }
        )

        res.json({
            status: "Success",
            message: deletedFolder.name+" folder deleted successfully!"
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: "Error",
            message: error
        })
    }

})

// Get Folders by WorkspaceID
const getFoldersByWorkspaceID = asyncHandler(async (req, res)=> {
    const workspaceID = req.params.workspaceID
    const currWorkspace = await Workspace.findById({_id:workspaceID})
    const workspaceName = currWorkspace.name;

    try {
        const folders = await Folder.find({workspace: workspaceID})

        if(folders.length > 0) {
            res.json({
                status: "Success",
                message: "Folders fetched successfully",
                folders,
                workspaceName
            })
        } else {
            res.json({
                status: "Error",
                message: "No folders found for this workspace.",
                workspaceName
            })
        }
    } catch(error) {
        console.log(error);
        res.json({
            status: "Error",
            error
        })
    }
    
})

// Add File - POST
const addFile = asyncHandler(async (req, res) => {
    const userID = req.body.userID;
    const fileName = req.body.name;
    const workspaceID = req.body.workspaceID;
    const folderID = req.params.folderID;
    
    validateMongoDbId(userID);
    validateMongoDbId(folderID);
    validateMongoDbId(workspaceID);

    const findFolder = await Folder.findOne({_id: folderID})
    const findFile = await Folder.findOne({ name: fileName, owner: userID, folder: folderID });

    if (!findFile && findFolder) {
        try {
            const newFile = await File.create({
                name: fileName,
                owner: userID,
                folder: folderID,
                workspace: workspaceID,
                data: "//Write your code here"
            });

            let folder = await Folder.findOneAndUpdate(
                { _id: folderID },
                {
                    $push: { files: {_id: newFile._id, name: fileName } }
                },
                {
                    new: true
                }
            )

            res.json({
                status: "Success",
                message: fileName+" file created successfully!"
            })
        } catch (error) {
            console.log(error);
            res.json({
                status: "Error",
                message: error
            })
        }
    }
})

// Delete File - DELETE
const deleteFile = asyncHandler(async (req, res) => {
    const fileID = req.params.fileID
    
    validateMongoDbId(fileID);

    try {
        const deletedFile = await File.findOneAndDelete({ _id: fileID })

        const folder = await Folder.findByIdAndUpdate(
            { _id: deletedFile.folder },
            {
                $pull:
                {
                    files: {_id:fileID}
                }
            },
            {
                new: true,
            }
        )

        res.json({
            status: "Success",
            message: deletedFile.name+" file deleted successfully!"
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: "Error",
            message: error
        })
    }

})

// Get Files by FolderID
const getFilesByFolderID = asyncHandler(async (req, res)=> {
    const folderID = req.params.folderID
    
    try {
        const files = await File.find({folder: folderID})

        if(files.length > 0) {
            res.json({
                status: "Success",
                message: "Files fetched successfully",
                files
            })
        } else {
            res.json({
                status: "Error",
                message: "No files found for this folder."
            })
        }
    } catch(error) {
        console.log(error);
        res.json({
            status: "Error",
            error
        })
    }
    
})

// Get Files by FolderID
const getFileByID = asyncHandler(async (req, res)=> {
    const fileID = req.body.fileID

    console.log(req.body);
    try {
        const file = await File.findById({_id: fileID})
console.log(file);
        if(file) {
            res.json({
                status: "Success",
                message: "File fetched successfully",
                file
            })
        } else {
            res.json({
                status: "Error",
                message: "No file found."
            })
        }
    } catch(error) {
        console.log(error);
        res.json({
            status: "Error",
            error
        })
    }
    
})

// Save code to server
const saveCode = asyncHandler(async (req,res)=> {
    const fileID = req.body.fileID;
    validateMongoDbId(fileID)
    
    const data = req.body.data;

    if(data){
        try{
        const currFile = await File.findByIdAndUpdate({_id:fileID},{ $set: {
            data: data
        }})

        res.json({
            status: "Success",
            file: currFile
        })

        } catch(error) {
            console.log(error);
        }
    }
})

module.exports = {
    getEditor,
    addWorkspace,
    getWorkspacesByUserID,
    deleteWorkspace,
    getFoldersByWorkspaceID,
    addFolder,
    deleteFolder,
    addFile,
	getFilesByFolderID,
	deleteFile,
    getFileByID,
    saveCode
};