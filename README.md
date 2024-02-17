# CodeCraftPro. - Collaborative Coding Enviroment
## Project Setup
1. Open terminal, run
	```
	git clone https://github.com/yashpra1010/code-craft-pro
	```
2. Goto backend folder to install backend dependencies.
	```
	cd backend
	npm install
	```
3. Goto frontend folder to install frontend dependencies.
	```
	cd frontend
	npm install
	```
4. Configure .env file in backend. By creating `.env` file
and copy and paste the below file into `.env` file and configure accordingly.
	```
	data of .env file
	```
## Backend Routes
#### User Routes

| Sr. No.|Description| Request Type  | Endpoint  |
|---|---|---|---|
|1|Sign Up| POST  | `/api/user/signup`  |
|2|Login| POST  |  `/api/user/login` |
|3|Logout|  GET |  `/api/user/logout` |
|4|OTP Verification|POST|`/api/user/otp-verification`|

#### Editor Routes

| Sr. No.|Description| Request Type  | Endpoint  |
|---|---|---|---|
|1|Get Code Editor| GET  | `/api/editor/:workspaceID/:folderID/:fileID`  |
|2|Add Workspace| POST  |  `/api/workspace/add` |
|3|Get Workspace|  GET |  `/api/workspace/get/:userID` |
|4|Delete Workspace|DELETE|`/api/workspace/delete/:id`|
|5|Add Folder|POST|`/api/folder/add/:workspaceID`|
|6|Get all the folders of individual workspace|GET|`/api/folder/get-all/:workspaceID`|
|7|Delete Folder|DELETE|`/api/folder/delete/:folderID`|
|8|Add File|POST|`/api/file/add/:folderID`|
|9|Get all the files of individual folder|GET|`/api/file/get-all/:folderID`|
|10|Delete File|DELETE|`/api/file/delete/:fileID`|

> Note: Correctly check the PORT where frontend and backend server is running