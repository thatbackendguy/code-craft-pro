const express = require("express");
const {
	getEditor,
	addWorkspace,
	getWorkspacesByUserID,
	deleteWorkspace,
	getFoldersByWorkspaceID,
	addFolder,
	deleteFolder,
	addFile,
	getFilesByFolderID,
	deleteFile
} = require("../controller/editorCtrl");

//initializing router
const router = express.Router();

router.get("/editor/:workspaceID/:folderID/:fileID", getEditor) // TESTING

// APIs for Workspace
router.post("/workspace/add",addWorkspace)
router.get("/workspace/get/:userID", getWorkspacesByUserID)
router.delete("/workspace/delete/:id",deleteWorkspace)

// APIs for Folder
router.post("/folder/add/:workspaceID", addFolder)
router.get("/folder/get-all/:workspaceID", getFoldersByWorkspaceID)
router.delete("/folder/delete/:folderID", deleteFolder)

// APIs for File
router.post("/file/add/:folderID", addFile)
router.get("/file/get-all/:folderID", getFilesByFolderID)
router.delete("/file/delete/:fileID", deleteFile)


module.exports = router;
