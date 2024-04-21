const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
const Folder = require("../models/folderModel");
const File = require("../models/fileModel");
const Comment = require("../models/commentModel");
const { sendEmail } = require("./emailCtrl");
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
    return res.status(409).json({
      status: "error",
      message: `A folder with the name "${folderName}" already exists in this workspace.`,
    });
  }

  if (!findWorkspace) {
    return res.json({
      status: "error",
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

    res.status(201).json({
      status: "success",
      message: `${folderName} folder created successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

// Add Workspace
const addWorkspace = asyncHandler(async (req, res) => {
  const userID = req.body.userID;
  const name = req.body.name;

  validateMongoDbId(userID);

  const findWorkspace = await Workspace.findOne({ name, owner: userID });

  if (findWorkspace) {
    return res.status(409).json({
      status: "error",
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

    res.status(201).json({
      status: "success",
      message: `${name} workspace created successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
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
    return res.status(409).json({
      status: "error",
      message: `A file with the name "${fileName}" already exists in this folder.`,
    });
  }

  if (!findFolder) {
    return res.json({
      status: "error",
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

    res.status(201).json({
      status: "success",
      message: `${fileName} file created successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

// Get Workspaces by User ID - GET
const getWorkspacesByUserID = asyncHandler(async (req, res) => {
  const userID = req.params.userID;
  try {
    const userWorkspaces = await Workspace.find({ owner: userID })

    //console.log(userWorkspaces)

    res.status(200).json({
      userWorkspaces
    })
  } catch (error) {
    console.log(error);

    res.json({
      status: "error",
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

    const files = await File.find({ workspace: workspaceID });

    const fileIds = files.map(file => file._id);

    const folders = await Folder.find({ workspace: workspaceID });

    const folderIds = folders.map(folder => folder._id);

    await File.deleteMany({ _id: { $in: fileIds } });

    await Folder.deleteMany({ _id: { $in: folderIds } });

    res.status(200).json({
      status: "success",
      message: deletedWorkspace.name + " workspace deleted successfully!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
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

    res.status(200).json({
      status: "success",
      message: deletedFolder.name + " folder deleted successfully!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
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
      res.status(200).json({
        status: "success",
        message: "Folders fetched successfully",
        folders,
        workspaceName
      })
    } else {
      res.json({
        status: "error",
        message: "No folders found for this workspace.",
        workspaceName
      })
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error,
      message: "Internal Server Error!"
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

    res.status(200).json({
      status: "success",
      message: deletedFile.name + " file deleted successfully!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
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
      res.status(200).json({
        status: "success",
        message: "Files fetched successfully",
        files
      })
    } else {
      res.json({
        status: "error",
        message: "No files found for this folder."
      })
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error,
      message: "Internal Server Error!"
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
      res.status(200).json({
        status: "success",
        message: "File fetched successfully",
        file
      })
    } else {
      res.json({
        status: "error",
        message: "No file found."
      })
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
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

      res.status(200).json({
        status: "success",
        file: currFile
      })

    } catch (error) {
      console.log(error);

      res.json({
        status: "error",
        file:"",
        "message": "Error while saving code into database!",
        "error": error
      })
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
      return res.json({ status: "error", message: "Workspace not found or you don't have permission to share this workspace." });
    }

    const ownerUser = await User.findById(ownerUserID);
    if (!ownerUser) {
      return res.json({ status: "error", message: "Owner user not found." });
    }


    if (ownerUser.email === guestEmailID) {
      return res.status(403).json({ status: "error", message: "Owner cannot add themselves as a collaborator." });
    }

    const guestUser = await User.findOne({ email: guestEmailID });
    if (!guestUser) {
      return res.json({ status: "error", message: "Guest user not found." });
    }

    const guestUserID = guestUser._id;
    if (workspace.sharedWith.includes(guestUserID)) {
      return res.status(409).json({ status: "error", message: "User is already a collaborator in this workspace." });
    }

    const updatedWorkspace = await Workspace.findOneAndUpdate(
      { _id: workspaceID, owner: ownerUserID },
      { $addToSet: { sharedWith: guestUserID } },
      { new: true }
    );

    await guestUser.updateOne(
      { $push: { sharedWithMe: workspaceID } },
      { new: true }
    );

    if (!updatedWorkspace) {
      return res.json({ status: "error", message: "Unable to share the workspace with the user!" });
    }

    res.status(200).json({ status: "success", message: "Workspace shared successfully!", updatedWorkspace });

  } catch (error) {
    console.error("error occurred while sharing workspace:", error);
    res.json({
      status: "error",
      message: "Unable to share the workspace with the user!",
      error: error.message
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
      return res.json({
        status: "error",
        message: "Workspace not found or you don't have permission to remove collaborators from this workspace."
      });
    }

    const guestUser = await User.findOne({ email: guestEmailID });

    if (!guestUser) {
      return res.json({
        status: "error",
        message: "Guest user not found."
      });
    }

    const guestUserID = guestUser._id;

    const updatedWorkspace = await Workspace.findOneAndUpdate(
      { _id: workspaceID, owner: ownerUserID, sharedWith: guestUserID },
      { $pull: { sharedWith: guestUserID } },
      { new: true }
    );

    await guestUser.updateOne(
      { $pull: { sharedWithMe: workspaceID } },
      { new: true }
    )

    if (!updatedWorkspace) {
      return res.status(401).json({
        status: "error",
        message: "The user is not a collaborator in this workspace."
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Collaborator removed successfully!",
      updatedWorkspace
    });
  } catch (error) {
    console.error("Error occurred while removing collaborator from workspace:", error);

    res.json({
      status: "error",
      message: "Unable to remove the collaborator from the workspace!",
      error: error.message
    });
  }
});

const getCollaboratorByWorkspaceID = asyncHandler(async (req, res) => {
  const workspaceID = req.params.workspaceID;
  validateMongoDbId(workspaceID);

  try {
    const workspace = await Workspace.findById({ _id: workspaceID })
      .populate({
        path: 'sharedWith',
        select: 'name email',
      });

    if (workspace) {
      res.status(200).json({
        status: "success",
        message: "Workspace fetched successfully",
        workspace,
      });
    } else {
      res.json({ status: "error", message: "No workspace found." });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error,message: "Internal Server Error!" });
  }
});

const getSharedWorkspacedByUserID = asyncHandler(async (req, res) => {
  const userID = req.params.userID;

  validateMongoDbId(userID);

  try {
    const user = await User.findById(userID).populate({ path: "sharedWithMe", select: 'name', })

    if (user) {
      res.status(200).json({
        status: "success",
        user,
        message: "User fetched successfully!"
      });
    } else {
      res.json({ status: "error", message: "User not found." });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error,message: "Internal Server Error!" });
  }
})

// POST - Add comment
const addComment = asyncHandler(async (req, res) => {
  let ownerUserName = ""
  const userID = req.body.userID;
  const commentMessage = req.body.message;
  const fileID = req.body.fileID;

  // Validate user and file IDs
  validateMongoDbId(userID);
  validateMongoDbId(fileID);

  try {
    // Find the user's email using the userID
    const senderUser = await User.findById(userID);
    if (!senderUser) {
      return res.json({
        status: "error",
        message: "User not found"
      });
    }

    const commentAddedBy = senderUser.name;

    // Find the file name using the fileID
    const file = await File.findById(fileID);
    if (!file) {
      return res.json({
        status: "error",
        message: "File not found"
      });
    }
    const fileName = file.name;
 
    const fileOwnerID = file.owner;

    // get owner of file
    const ownerUser = await User.findById(fileOwnerID);

    if (!senderUser) {
      return res.json({
        status: "error",
        message: "User not found"
      });
    } else {
      ownerUserName = ownerUser.name;
    }

    // Create the comment
    const newComment = await Comment.create({
      user: userID,
      fileID: fileID,
      message: commentMessage
    });

    try {
      const payload = `<table class="body-wrap" style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important;">
      <tbody>
        <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
          <td class="container" style="margin: 0 auto !important; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; display: block !important; clear: both !important; max-width: 580px !important;">
            <!-- Message start -->
            <table style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; border-collapse: collapse; width: 100%; height: 200px;">
              <tbody>
                <tr style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; height: 136px;">
                  <td class="masthead" style="margin: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; background: #030014; color: white; height: 136px;" align="center">
                    <h1>👨🏻‍💻 CodeCraftPro.</h1>
                  </td>
                </tr>
                <tr style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; height: 473px;">
                  <td class="content" style="margin: 0px; padding: 30px 35px; font-size: 100%; line-height: 1.65; background: #030014; height: 473px;">
                    <h2 style="font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; margin: 0px 0px 20px; padding: 0px; font-size: 28px; line-height: 1.25;">
                      <span style="color: #b6b2ff;">Hi ${ownerUserName} 👋,</span>
                    </h2>
                    <p>
                      <span style="color: #b6b2ff;">A new comment has been added to the file <strong>${fileName}</strong> by <strong>${commentAddedBy}</strong>.</span>
                    </p>
                    <p>
                      <span style="color: #b6b2ff;">Here's the comment:</span>
                    </p>
                    <blockquote style="margin: 0 0 20px; padding: 0 0 0 15px; border-left: 5px solid #7000FF;">
                      <span style="color: #b6b2ff;">${commentMessage}</span>
                    </blockquote>
                    <p style="font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; margin: 0px 0px 20px; padding: 0px; font-size: 16px; line-height: 1.65; font-weight: normal;">
                      <span style="color: #b6b2ff;">
                        <em style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">– Team CodeCraftPro.</em>
                      </span>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
          <td class="container" style="margin: 0 auto !important; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; display: block !important; clear: both !important; max-width: 580px !important;">
            <span style="color: #b6b2ff;"><!-- Message start --></span>
            <table style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; border-collapse: collapse; width: 100% !important;">
              <tbody>
                <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
                  <td class="content footer" style="margin: 0; padding: 30px 35px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; background: none;" align="center">&copy; CodeCraftPro, ${new Date().getFullYear()}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    `;
      const data = {
        to: ownerUser.email,
        text: `New Comment Added by ${commentAddedBy}`,
        subject: "New Comment Added",
        htm: payload,
      };

      sendEmail(data);

    } catch (error) {
      throw new Error(error);
    }

    // Send success response
    res.status(201).json({
      status: "success",
      message: "Comment added successfully!",
      comment: newComment,
    });
  } catch (error) {
    // Send error response
    console.log(error);
    res.json({
      status: "error",
      message: "Failed to add comment",
      error: error
    });
  }
});

const resolveComment = asyncHandler(async (req, res) => {
  const commentID = req.params.commentID;

  // Validate comment ID
  validateMongoDbId(commentID);

  try {
    // Find the comment
    const comment = await Comment.findById(commentID).populate('user').populate('fileID');
    if (!comment) {
      return res.json({
        status: "error",
        message: "Comment not found"
      });
    }

    // Remove the comment
    await Comment.findOneAndDelete({_id:commentID});

    // Send an email to notify that the comment has been resolved
    const payload = `
      <table class="body-wrap" style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; height: 100%; background: #efefef; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important;">
        <tbody>
          <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
            <td class="container" style="margin: 0 auto !important; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; display: block !important; clear: both !important; max-width: 580px !important;">
              <!-- Message start -->
              <table style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; border-collapse: collapse; width: 100%; height: 200px;">
                <tbody>
                  <tr style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; height: 136px;">
                    <td class="masthead" style="margin: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; background: #030014; color: white; height: 136px;" align="center">
                      <h1>👨🏻‍💻 CodeCraftPro.</h1>
                    </td>
                  </tr>
                  <tr style="margin: 0px; padding: 0px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; line-height: 1.65; height: 473px;">
                    <td class="content" style="margin: 0px; padding: 30px 35px; font-size: 100%; line-height: 1.65; background: #030014; height: 473px;">
                      <h2 style="font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; margin: 0px 0px 20px; padding: 0px; font-size: 28px; line-height: 1.25;">
                        <span style="color: #b6b2ff;">Hi ${comment.user.name} 👋,</span>
                      </h2>
                      <p>
                        <span style="color: #b6b2ff;">The comment you added on the file <strong>${comment.fileID.name}</strong> has been resolved.</span>
                      </p>
                      <p style="font-family: 'Avenir Next', 'Helvetica Neue', Helvetica, Helvetica, Arial, sans-serif; margin: 0px 0px 20px; padding: 0px; font-size: 16px; line-height: 1.65; font-weight: normal;">
                        <span style="color: #b6b2ff;">
                          <em style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">– Team CodeCraftPro.</em>
                        </span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
            <td class="container" style="margin: 0 auto !important; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; display: block !important; clear: both !important; max-width: 580px !important;">
              <span style="color: #b6b2ff;"><!-- Message start --></span>
              <table style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; border-collapse: collapse; width: 100% !important;">
                <tbody>
                  <tr style="margin: 0; padding: 0; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65;">
                    <td class="content footer" style="margin: 0; padding: 30px 35px; font-size: 100%; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; line-height: 1.65; background: none;" align="center">&copy; CodeCraftPro, ${new Date().getFullYear()}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    const data = {
      to: comment.user.email,
      text: `Your comment on ${comment.fileID.name} has been resolved`,
      subject: "Comment Resolved",
      htm: payload,
    };

    sendEmail(data);

    // Send success response
    res.status(200).json({
      status: "success",
      message: "Comment removed successfully!",
    });
  } catch (error) {
    // Send error response
    console.error(error);
    res.json({
      status: "error",
      message: "Failed to remove comment",
      error: error
    });
  }
});

// Get Comments by FileID - GET
const getComments = asyncHandler(async (req, res) => {
  const fileID = req.params.fileID

  try {
    const comments = await Comment.find({ fileID: fileID })
  .populate({
    path: "user",
    select: "name email",
  });


    if (comments.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Comments fetched successfully",
        comments
      })
    } else {
      res.json({
        status: "error",
        message: "No comments found for this file.",
      })
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error,
      message: "Internal Server Error!"
    })
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
  getSharedWorkspacedByUserID,
  addComment,
  resolveComment,
  getComments
};