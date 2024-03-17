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
	deleteFile,
	getFileByID,
	saveCode,
	addCollaboratorToWorkspace,
	removeCollaboratorFromWorkspace,
	addCollaboratorToFolder,
	removeCollaboratorFromFolder
} = require("../controller/editorCtrl");

//initializing router
const router = express.Router();

router.get("/editor/:workspaceID/:folderID/:fileID", getEditor) // TESTING

// APIs for Workspace
router.post("/workspace/add",addWorkspace)
router.get("/workspace/get/:userID", getWorkspacesByUserID)
router.delete("/workspace/delete/:id",deleteWorkspace)
router.post("/workspace/share/:workspaceID",addCollaboratorToWorkspace)
router.delete("/workspace/share/:workspaceID",removeCollaboratorFromWorkspace)

// APIs for Folder
router.post("/folder/add/:workspaceID", addFolder)
router.get("/folder/get-all/:workspaceID", getFoldersByWorkspaceID)
router.delete("/folder/delete/:folderID", deleteFolder)
router.post("/folder/share/:folderID",addCollaboratorToFolder)
router.delete("/folder/share/:folderID",removeCollaboratorFromFolder)

// APIs for File
router.post("/file/add/:folderID", addFile)
router.get("/file/get-all/:folderID", getFilesByFolderID)
router.post("/file/get/", getFileByID)
router.delete("/file/delete/:fileID", deleteFile)
router.put("/file/save-code/", saveCode)


module.exports = router;
