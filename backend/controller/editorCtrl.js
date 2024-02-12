const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
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

    const findWorkspace = await Workspace.findOne({ name:name,owner: userID });

    if(!findWorkspace) {
        try {
            const newWorkspace = await Workspace.create({
                name: name,
                owner: userID
            });
            const workspaceID = await newWorkspace.id
            let user = await User.findOneAndUpdate(
                {_id:userID},
                {
                    $push: {workspaces: workspaceID}
                },
                {
                    new: true
                }
            )

            console.log(user);

            console.log(newWorkspace)

            res.json({
                status: "Success",
                message: "Workspace created"
            })
        } catch(error) {
            console.log(error);
            res.json({
                status: "Error",
                message: error
            })
        }
    }
})

// Get Workspaces by User ID - GET
const getWorkspaceByID = asyncHandler(async (req,res) => {
    const userID = req.params.userID;
    try {
        const userWorkspaces = await Workspace.find({owner:userID})

        //console.log(userWorkspaces)

        res.json({
            userWorkspaces
        })
    } catch(error) {
        console.log(error);

        res.json({
            status: "Error",
            message: error
        })
    }
})

// Delete workspace - DELETE
const deleteWorkspace = asyncHandler(async (req,res) => {
    const workspaceID = req.params.id;
    
    validateMongoDbId(workspaceID)

    try {
        const deletedWorkspace = await Workspace.deleteOne({_id:workspaceID})
        res.json({
            status: "Success",
            message: "Workspace deleted successfully!"
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: "Error",
            message: error
        })
    }
})


module.exports = {
    getEditor,
    addWorkspace,
    getWorkspaceByID,
    deleteWorkspace
};