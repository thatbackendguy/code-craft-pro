const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Add Folder
const addFolder = asyncHandler(async (req, res) => {
  const userID = req.body.userID;
  const folderName = req.body.name;
  const workspaceID = req.params.workspaceID;

  validateMongoDbId(userID);
  validateMongoDbId(workspaceID);

  const findWorkspace = await Workspace.findOne({ _id: workspaceID });
  const findFolder = await Folder.findOne({
    name: folderName,
    owner: userID,
    workspace: workspaceID,
  });

  if (findFolder) {
    return res.json({
      status: "Error",
      message: `A folder with the name "${folderName}" already exists in this workspace.`,
    });
  }

  if (!findWorkspace) {
    return res.json({
      status: "Error",
      message: "Workspace not found.",
    });
  }

  try {
    const newFolder = await Folder.create({
      name: folderName,
      owner: userID,
      workspace: workspaceID,
    });

    let workspace = await Workspace.findOneAndUpdate(
      { _id: workspaceID },
      { $push: { folders: newFolder._id } },
      { new: true }
    );

    res.json({
      status: "Success",
      message: `${folderName} folder created successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "Error", message: error });
  }
});

// Add Workspace
const addWorkspace = asyncHandler(async (req, res) => {
  const userID = req.body.userID;
  const name = req.body.name;

  validateMongoDbId(userID);

  const findWorkspace = await Workspace.findOne({ name, owner: userID });

  if (findWorkspace) {
    return res.json({
      status: "Error",
      message: `A workspace with the name "${name}" already exists.`,
    });
  }

  try {
    const newWorkspace = await Workspace.create({ name, owner: userID });
    const workspaceID = newWorkspace._id;

    let user = await User.findOneAndUpdate(
      { _id: userID },
      { $push: { workspaces: workspaceID } },
      { new: true }
    );

    res.json({
      status: "Success",
      message: `${name} workspace created successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "Error", message: error });
  }
});

// Add File
const addFile = asyncHandler(async (req, res) => {
  const userID = req.body.userID;
  const fileName = req.body.name;
  const workspaceID = req.body.workspaceID;
  const folderID = req.params.folderID;

  validateMongoDbId(userID);
  validateMongoDbId(folderID);
  validateMongoDbId(workspaceID);

  const findFolder = await Folder.findOne({ _id: folderID });
  const findFile = await File.findOne({
    name: fileName,
    owner: userID,
    folder: folderID,
  });

  if (findFile) {
    return res.json({
      status: "Error",
      message: `A file with the name "${fileName}" already exists in this folder.`,
    });
  }

  if (!findFolder) {
    return res.json({
      status: "Error",
      message: "Folder not found.",
    });
  }

  try {
    const newFile = await File.create({
      name: fileName,
      owner: userID,
      folder: folderID,
      workspace: workspaceID,
      data: "//Write your code here",
    });

    let folder = await Folder.findOneAndUpdate(
      { _id: folderID },
      { $push: { files: newFile._id } },
      { new: true }
    );

    res.json({
      status: "Success",
      message: `${fileName} file created successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "Error", message: error });
  }
});

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
      message: deletedWorkspace.name + " workspace deleted successfully!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      status: "Error",
      message: error
    })
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
      message: deletedFolder.name + " folder deleted successfully!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      status: "Error",
      message: error
    })
  }

})

// Get Folders by WorkspaceID - GET
const getFoldersByWorkspaceID = asyncHandler(async (req, res) => {
  const workspaceID = req.params.workspaceID
  const currWorkspace = await Workspace.findById({ _id: workspaceID })
  const workspaceName = currWorkspace.name;

  try {
    const folders = await Folder.find({ workspace: workspaceID }).populate("files")

    if (folders.length > 0) {
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
  } catch (error) {
    console.log(error);
    res.json({
      status: "Error",
      error
    })
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
          files: { _id: fileID }
        }
      },
      {
        new: true,
      }
    )

    res.json({
      status: "Success",
      message: deletedFile.name + " file deleted successfully!"
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
const getFilesByFolderID = asyncHandler(async (req, res) => {
  const folderID = req.params.folderID

  try {
    const files = await File.find({ folder: folderID })

    if (files.length > 0) {
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
  } catch (error) {
    console.log(error);
    res.json({
      status: "Error",
      error
    })
  }

})

// Get Files by FolderID
const getFileByID = asyncHandler(async (req, res) => {
  const fileID = req.body.fileID
  validateMongoDbId(fileID)
  // console.log(req.body);
  try {
    const file = await File.findById({ _id: fileID })
    // console.log(file);
    if (file) {
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
  } catch (error) {
    console.log(error);
    res.json({
      status: "Error",
      error
    })
  }

})

// Save code to server - PUT
const saveCode = asyncHandler(async (req, res) => {
  const fileID = req.body.fileID;
  validateMongoDbId(fileID)

  const data = req.body.data;

  if (data) {
    try {
      const currFile = await File.findByIdAndUpdate({ _id: fileID }, {
        $set: {
          data: data
        }
      })

      res.json({
        status: "Success",
        file: currFile
      })

    } catch (error) {
      console.log(error);
    }
  }
})

// add collaborator to workspace - POST
const addCollaboratorToWorkspace = asyncHandler(async (req, res) => {
  try {
    const ownerUserID = req.body.ownerUserID;
    const guestEmailID = req.body.guestEmailID;
    const workspaceID = req.params.workspaceID;

    validateMongoDbId(ownerUserID);
    validateMongoDbId(workspaceID);

    const workspace = await Workspace.findOne({ _id: workspaceID, owner: ownerUserID });
    if (!workspace) {
      return res.status(404).json({ status: "Error", message: "Workspace not found or you don't have permission to share this workspace." });
    }

    const ownerUser = await User.findById(ownerUserID);
    if (!ownerUser) {
      return res.status(404).json({ status: "Error", message: "Owner user not found." });
    }

    // Check if the owner is trying to add themselves as a collaborator
    if (ownerUser.email === guestEmailID) {
      return res.status(400).json({ status: "Error", message: "Owner cannot add themselves as a collaborator." });
    }

    const guestUser = await User.findOne({ email: guestEmailID });
    if (!guestUser) {
      return res.status(404).json({ status: "Error", message: "Guest user not found." });
    }

    const guestUserID = guestUser._id;
    if (workspace.sharedWith.includes(guestUserID)) {
      return res.status(400).json({ status: "Error", message: "User is already a collaborator in this workspace." });
    }

    const updatedWorkspace = await Workspace.findOneAndUpdate(
      { _id: workspaceID, owner: ownerUserID },
      { $addToSet: { sharedWith: guestUserID } },
      { new: true }
    );

    const updatedGuest = await guestUser.updateOne(
      { $push: { sharedWithMe: workspaceID } },
      { new: true }
    );

    if (!updatedWorkspace) {
      return res.status(500).json({ status: "Error", message: "Unable to share the workspace with the user!" });
    }

    res.json({ status: "Success", message: "Workspace shared successfully!", updatedWorkspace });
  } catch (error) {
    console.error("Error occurred while sharing workspace:", error);
    res.status(500).json({
      status: "Error",
      message: "Unable to share the workspace with the user!",
      error: error.message // Send error message for debugging purposes
    });
  }
});

// remove collaborator from workspace - DELETE
const removeCollaboratorFromWorkspace = asyncHandler(async (req, res) => {

  try {
    const ownerUserID = req.body.ownerUserID;
    const guestEmailID = req.body.guestEmailID;
    const workspaceID = req.params.workspaceID;

    validateMongoDbId(ownerUserID);
    validateMongoDbId(workspaceID);

    const workspace = await Workspace.findOne({ _id: workspaceID, owner: ownerUserID });

    if (!workspace) {
      return res.status(404).json({
        status: "Error",
        message: "Workspace not found or you don't have permission to remove collaborators from this workspace."
      });
    }

    const guestUser = await User.findOne({ email: guestEmailID });

    if (!guestUser) {
      return res.status(404).json({
        status: "Error",
        message: "Guest user not found."
      });
    }

    const guestUserID = guestUser._id;

    const updatedWorkspace = await Workspace.findOneAndUpdate(
      { _id: workspaceID, owner: ownerUserID, sharedWith: guestUserID },
      { $pull: { sharedWith: guestUserID } },
      { new: true }
    );

    const updatedGuest = await guestUser.updateOne(
      { $pull: { sharedWithMe: workspaceID } },
      { new: true }
    )

    if (!updatedWorkspace) {
      return res.status(404).json({
        status: "Error",
        message: "The user is not a collaborator in this workspace."
      });
    }

    return res.json({
      status: "Success",
      message: "Collaborator removed successfully!",
      updatedWorkspace
    });
  } catch (error) {
    console.error("Error occurred while removing collaborator from workspace:", error);
    res.status(500).json({
      status: "Error",
      message: "Unable to remove the collaborator from the workspace!",
      error: error.message // Send error message for debugging purposes
    });
  }
});

// Get users of common workspace
const getCollaboratorByWorkspaceID = asyncHandler(async (req, res) => {
  const workspaceID = req.params.workspaceID;
  validateMongoDbId(workspaceID);

  try {
    const workspace = await Workspace.findById({ _id: workspaceID })
      .populate({
        path: 'sharedWith',
        select: 'name email', // Specify the fields you want to include
      });

    if (workspace) {
      res.json({
        status: "Success",
        message: "Workspace fetched successfully",
        workspace,
      });
    } else {
      res.json({ status: "Error", message: "No workspace found." });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "Error", error });
  }
});


const getSharedWorkspacedByUserID = asyncHandler(async (req, res) => {
  const userID = req.params.userID;

  validateMongoDbId(userID);

  try {
    const user = await User.findById(userID).populate({ path: "sharedWithMe", select: 'name', })

    if (user) {
      res.json({
        status: "Success",
        user,
        message: "User fetched successfully!"
      });
    } else {
      res.json({ status: "Error", message: "User not found." });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "Error", error });
  }
})

module.exports = {
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
  saveCode,
  addCollaboratorToWorkspace,
  removeCollaboratorFromWorkspace,
  getCollaboratorByWorkspaceID,
  getSharedWorkspacedByUserID
};