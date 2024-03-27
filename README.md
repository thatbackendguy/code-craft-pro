# CodeCraftPro. - Collaborative Coding Enviroment
> Recommended to use Node v20.0 or higher
Check your Node version by
```
node -v
```
For installing latest Node version for Ubuntu (snap)
```
sudo snap install node --classic
```

## Project Setup
1. Open terminal, run
	```
	git clone https://github.com/yashpra1010/code-craft-pro
	```
2. Goto backend folder to install backend dependencies.
	```
	cd backend
	npm install
	npm run dev
	```
3. Goto frontend folder to install frontend dependencies.
	```
	cd frontend
	npm install
	npm start
	```
4. Configure .env file in `backend` folder. By creating `.env` file
and copy and paste the below file into `.env` file and configure accordingly.
	```
	DB_URI=
	SMTP_EMAIL=
	SMTP_PASSWORD=
	JWT_SECRET=
	SMTP_HOST=
	AES_SECRET=
	```

5. Configure .env file in `frontend` folder. By creating `.env` file
and copy and paste the below file into `.env` file and configure accordingly.
	```
	REACT_APP_BACKEND_URL=
	```
## Backend Routes
#### User Routes

| Sr. No.|Description| Request Type  | Endpoint  |
|---|---|---|---|
|1|Sign Up| POST  | `/api/user/signup`  |
|2|Login| POST  |  `/api/user/login` |
|3|Logout|  GET |  `/api/user/logout` |
|4|OTP Verification|POST|`/api/user/otp-verification`|
5|Get User Metrics Data|GET|`/api/user/profile/:userID`|

#### Editor Routes

| Sr. No.|Description| Request Type  | Endpoint  |
|---|---|---|---|
|1|Get Code Editor| GET  | `/api/editor/:workspaceID/:folderID/:fileID`  |
|2|Add Workspace| POST  |  `/api/workspace/add` |
|3|Get Workspace|  GET |  `/api/workspace/get/:userID` |
|4|Delete Workspace|DELETE|`/api/workspace/delete/:id`|
|5|Share Workspace|POST|`/api/workspace/share/:workspaceID`|
|6|Remove shared workspace|DELETE|`/api/workspace/share/:workspaceID`|
|7|Add Folder|POST|`/api/folder/add/:workspaceID`|
|8|Get all the folders of individual workspace|GET|`/api/folder/get-all/:workspaceID`|
|9|Delete Folder|DELETE|`/api/folder/delete/:folderID`|
|10|Share folder|POST|`/api/folder/share/:folderID`|
|11|Remove shared folder|DELETE|`/api/folder/share/:folderID`|
|12|Add File|POST|`/api/file/add/:folderID`|
|13|Get all the files of individual folder|GET|`/api/file/get-all/:folderID`|
|14|Delete File|DELETE|`/api/file/delete/:fileID`|
|15|Get File|POST|`/api/file/get/`|
|16|Save code in file|PUT|`/api/file/save-code/`|
|17|Add Collaborator to Workspace|POST|`/api/workspace/share/:workspaceID`|
|18|Remove Collaborator from Workspace|POST|`/api/workspace/share/delete/:workspaceID`|
|19|Get Collaborators by WorkspaceID|GET|`/api/workspace/share/:workspaceID`|
|20|Get Shared Workspace By UserID|GET|`/api/workspace/shared-with-me/:userID`|

> Note: Correctly check the PORT where frontend and backend server is running