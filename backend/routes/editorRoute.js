const express = require("express");
const {
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
} = require("../controller/editorCtrl");

//initializing router
const router = express.Router();

// APIs for Workspace
router.post("/workspace/add",addWorkspace)
router.get("/workspace/get/:userID", getWorkspacesByUserID)
router.delete("/workspace/delete/:id",deleteWorkspace)
router.post("/workspace/share/:workspaceID",addCollaboratorToWorkspace)
router.post("/workspace/share/delete/:workspaceID",removeCollaboratorFromWorkspace)
router.get('/workspace/share/:workspaceID',getCollaboratorByWorkspaceID)
router.get('/workspace/shared-with-me/:userID',getSharedWorkspacedByUserID)

// APIs for Folder
router.post("/folder/add/:workspaceID", addFolder)
router.get("/folder/get-all/:workspaceID", getFoldersByWorkspaceID)
router.delete("/folder/delete/:folderID", deleteFolder)

// APIs for File
router.post("/file/add/:folderID", addFile)
router.get("/file/get-all/:folderID", getFilesByFolderID)
router.post("/file/get/", getFileByID)
router.delete("/file/delete/:fileID", deleteFile)
router.put("/file/save-code/", saveCode)


module.exports = router;
