const express = require("express");
const {
	getEditor,
	addWorkspace,
	getWorkspacesByUserID,
	deleteWorkspace,
	getFoldersByWorkspaceID,
	addFolder,
	deleteFolder
} = require("../controller/editorCtrl");

//initializing router
const router = express.Router();

router.get("/editor/:workspaceID/:folderID/:fileID", getEditor)
router.post("/workspace/add",addWorkspace)
router.get("/workspace/get/:userID", getWorkspacesByUserID)
router.delete("/workspace/delete/:id",deleteWorkspace)
router.post("/folder/add/:workspaceID", addFolder)
router.get("/folder/get-all/:workspaceID", getFoldersByWorkspaceID)
router.delete("/folder/delete/:folderID", deleteFolder)

module.exports = router;
