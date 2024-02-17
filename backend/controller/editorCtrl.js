const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
const Folder = require("../models/folderModel");
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
    
    try {
        const folders = await Folder.find({workspace: workspaceID})

        if(folders != "") {
            res.json({
                status: "Success",
                message: "Folders fetched successfully",
                folders
            })
        } else {
            res.json({
                status: "Error",
                message: "No folders found for the workspace."
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

module.exports = {
    getEditor,
    addWorkspace,
    getWorkspacesByUserID,
    deleteWorkspace,
    getFoldersByWorkspaceID,
    addFolder,
    deleteFolder
};