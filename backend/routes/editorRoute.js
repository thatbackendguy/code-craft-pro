const express = require("express");
const {
	getEditor,
	addWorkspace,
	getWorkspaceByID,
	deleteWorkspace
} = require("../controller/editorCtrl");

//initializing router
const router = express.Router();

router.get("/editor/:workspaceID/:folderID/:fileID", getEditor)
router.post("/workspace/add",addWorkspace)
router.get("/workspace/get/:userID", getWorkspaceByID)
router.delete("/workspace/delete/:id",deleteWorkspace)

module.exports = router;
