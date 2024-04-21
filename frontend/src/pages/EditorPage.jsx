import io from "socket.io-client";

import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import Navbar from "../components/Navbar";

import { Layout, Menu as AntMenu, theme, Modal, Input, Button } from "antd";

import axios from "axios";
import { useLocation } from "react-router-dom";
import { VscNewFolder, VscFolder, VscNewFile, VscFile } from "react-icons/vsc";
import { IoTrashBinOutline } from "react-icons/io5";
import Loader from "../components/Loader"
import CommentModal from "../components/CommentModal";
import {toast,Toaster} from "react-hot-toast";
const { Content, Sider } = Layout;

// for socket.io
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io.connect(BACKEND_URL);

const EditorPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef(null);
  // console.log(code);
  const handledEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const location = useLocation();
  const currentPath = location.pathname;
  const parts = currentPath.split("/"); // Split the URL string by "/"
  const workspaceID = parts[parts.length - 1];

  // USE STATES
  const [data, setData] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [commentModal, setCommentModal] = useState(false)
  const [comments, setComments] = useState()
  const [userComment, setUserComment] = useState()
  const [commentLoading, setCommentLoading] = useState(false)


  // CODE
  const getFoldersFromServer = async () => {
    try {
      // Access the last segment
      const response = await fetch(
        BACKEND_URL + `/api/folder/get-all/${workspaceID}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();

      setLoading(false)
      setWorkspaceName(res.workspaceName);
      setData(res.folders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleFileClick = (fileID) => {
    if (fileID !== "") {
      // console.log(fileID);
      socket.emit("join_common_file", fileID);
    }

    setSelectedFileId(fileID);
    getFileData(fileID);
  };

  const getFileData = async (fileID) => {
    try {
      const res = await axios.post(BACKEND_URL + "/api/file/get", {
        fileID: fileID,
      });
      const fileName = res?.data?.file?.name;
      const fileExtension = getFileExtension(fileName);
      const languageModes = {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        py: "python",
        html: "html",
        css: "css",
        scss: "scss",
        less: "less",
        java: "java",
        cpp: "cpp",
        c: "c",
        cs: "csharp",
        vb: "vb",
        php: "php",
        go: "go",
        ruby: "ruby",
        swift: "swift",
        md: "markdown",
        xml: "xml",
        yml: "yaml",
        json: "json",
        sh: "bash",
        bat: "bat",
        sql: "sql",
        r: "r",
        clj: "clojure",
        m: "objective-c",
        kt: "kotlin",
        scala: "scala",
        rust: "rust",
      };

      const language = languageModes[fileExtension] || "";
      setLanguage(language);
      setCode(res.data.file.data);
    } catch (error) {
      console.log(error);
    }
  };

  function getFileExtension(fileName) {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return "";
    }
    return fileName.slice(lastDotIndex + 1).toLowerCase();
  }

  const getComments = async () => {
    setCommentLoading(true)
    try {
      const response = await axios.get(BACKEND_URL + `/api/file/comment-get/${selectedFileId}`);
      console.log(response.data)
      const res = await response;
      if (response.data.status === "success") {
        setComments(res.data.comments);
      }
      else {
        setComments([])
      }
    } catch (error) {
      console.log(error);
      setComments([])
    }
    setCommentLoading(false)
  }

  const addComment = async (comment) => {
    try {
      const response = await axios.post(BACKEND_URL + `/api/file/comment-add`, {
        message: comment,
        fileID: selectedFileId,
        userID: localStorage.getItem("userID")
      });
      if(response.data.status === "success")
      {
        // console.log(response.data)
        toast.success(response.data.message);
        getComments();
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const resolveComment = async (commentID) => {
    try {
      const response = await axios.delete(BACKEND_URL + `/api/file/comment-resolve/${commentID}`);

      if(response.data.status === "success")
      {
        // console.log(response.data)
        toast.success(response.data.message);
        getComments();
      }
      else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const saveFileData = async () => {
    try {
      socket.emit("send_user_code", { userCode: code, fileID: selectedFileId });
      try {
        if (selectedFileId) {
          const res = await axios.put(BACKEND_URL + "/api/file/save-code/", {
            fileID: selectedFileId,
            data: code,
          });
          if (res.data.status === "success") { setLoading(false) }
        }
      } catch (error) {
        console.error("error saving code to backend:", error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCurrFile = async (fileID) => {
    try {
      const response = await fetch(BACKEND_URL + `/api/file/delete/${fileID}`, {
        method: "DELETE",
      });
      const res = await response.json();
      // console.log(res);
      setLoading(false)

      if (res.status === "success") {
        getFoldersFromServer();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const items2 = data?.map((folder, index) => {
    const key = `sub${index + 1}`;

    return {
      key: key,
      icon: React.createElement(VscFolder),
      label: (
        <div onClick={() => handleFolderClick(folder._id)}>{folder.name}</div>
      ),

      children: folder.files.map((file, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: (
            <div className="flex w-full items-center justify-between">
              <h1
                className="flex items-center"
                onClick={() => handleFileClick(file._id)}
              >
                <VscFile className="mr-2" /> {file.name}
              </h1>
              <IoTrashBinOutline onClick={() => deleteCurrFile(file._id)} />
            </div>
          ),
        };
      }),
    };
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const getEditorValue = () => {
    setCode(editorRef?.current?.getValue());

    saveFileData();
  };

  const getSharedWorkspaces = async () => {
    try {
      const response = await fetch(
        BACKEND_URL + `/api/workspace/share/${workspaceID}`,
        {
          method: "GET",
        }
      );

      const res = await response.json();
      setLoading(false)
      const userID = localStorage.getItem("userID");

      const isOwner = res.workspace.owner === userID;

      // console.log(`${res.workspace.owner} === ${userID}`, isOwner);

      if (!isOwner) {
        const isAuthenticated =
          res?.workspace?.sharedWith?.filter((item) => item._id === userID)
            .length > 0;

        if (isAuthenticated) {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TO RESTRICT UNAUTHENTICATED LOGIN
  useEffect(() => {
    getFoldersFromServer();
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  useEffect(() => {
    getSharedWorkspaces();
  }, []);


  const showCommentModal = () => {
    setComments([])
    getComments();
    setCommentModal(true)
  }
  // useEffect for socket
  useEffect(() => {
    socket.on("receive_user_code", (data) => {

      setCode(data.userCode);
    });
  }, [socket]);

  const handleAddFolder = () => {
    setShowAddFolderModal(true);
  };

  const handleAddFolderSubmit = async () => {
    //console.log(formData.name, localStorage.getItem("userID"))

    try {
      const response = await axios.post(
        BACKEND_URL + `/api/folder/add/${workspaceID}`,
        {
          name: formData.name,
          userID: localStorage.getItem("userID"),
        }
      );
      setLoading(false)
      if (response?.data?.status === "success") {
        getFoldersFromServer();
        formData.name = ""
      }
    } catch (error) {
      console.log(error);
    }

    setShowAddFolderModal(false);
  };

  const handleAddFile = () => {
    setShowAddFileModal(true);
  };

  const handleAddFileSubmit = async () => {
    try {
      const response = await axios.post(
        BACKEND_URL + `/api/file/add/${selectedFolderId}`,
        {
          name: formData.name,
          userID: localStorage.getItem("userID"),
          workspaceID: workspaceID,
        }
      );
      setLoading(false)
      if (response?.data?.status === "success") {
        getFoldersFromServer();
        formData.name = ""
      }
    } catch (error) {
      console.log(error);
    }

    setShowAddFileModal(false);
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Toaster/>

      {isLoading ? <Loader /> : !isAuthenticated ? (
        <h1 className="min-h-[80vh] w-full flex justify-center items-center text-3xl">
          Not Authorized! ⛔️
        </h1>
      ) : (<>
        {selectedFileId && <button className="bg-blue-500 rounded-full px-4 py-2 text-white inline-block w-[100px] ml-auto my-2 mr-6"
          onClick={showCommentModal}>Comment</button>}
        <CommentModal visible={commentModal} setVisible={setCommentModal}
          setUserComment={setUserComment} addComment={addComment} comments={comments}
          resolveComment={resolveComment} commentLoading={commentLoading}
        />

        <Layout className="pt-5">
          <Sider
            width={250}
            style={{ background: colorBgContainer }}
            className="rounded-md"
          >
            <div className="w-full flex justify-between items-center p-4 bg-gray-200 rounded-md">
              <h1>{workspaceName}</h1>
              <h1 className="flex items-center">
                <button
                  disabled={selectedFolderId === null}
                  className={
                    selectedFolderId === null
                      ? `hover:cursor-not-allowed`
                      : `hover:cursor-pointer`
                  }
                >
                  <VscNewFile onClick={handleAddFile} />
                </button>

                <VscNewFolder
                  className={`hover:cursor-pointer ml-2`}
                  onClick={handleAddFolder}
                />
              </h1>
            </div>
            {data?.length > 0 ? (
              <AntMenu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
                items={items2}
              />
            ) : (
              <div className="w-full h-full rounded-md">
                <div className="w-full h-full grid items-center justify-center">
                  <h1>No Folders</h1>
                </div>
              </div>
            )}
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {code.length > 0 ? (
                <Editor
                  height="80vh"
                  width="100%"
                  theme="vs-dark"
                  language={language}
                  onChange={getEditorValue}
                  value={code}
                  onMount={handledEditorDidMount}
                  options={{
                    fontSize: "20px",
                    wordWrap: true,
                    renderLineHighlight: true,
                  }}
                />
              ) : (
                <h1 className="grid items-center justify-center w-full min-h-[87vh]">Choose a file to start editing</h1>
              )}
            </Content>
          </Layout>
        </Layout>
      </>
      )}
      <Modal
        title="Add Folder"
        visible={showAddFolderModal}
        onCancel={() => setShowAddFolderModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowAddFolderModal(false)}
            className="cancel-button-model-workspace"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddFolderSubmit}
            className="bg-blue-500 text-white"
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          id="name"
          onChange={handleInputChange}
          value={formData.name}
          placeholder="Enter folder name"
        />
      </Modal>

      {/* FILE INPUT MODAL */}
      <Modal
        title="Add File"
        visible={showAddFileModal}
        onCancel={() => setShowAddFileModal(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setShowAddFileModal(false)}
            className="cancel-button-model-workspace"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddFileSubmit}
            className="bg-blue-500 text-white"
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          id="name"
          onChange={handleInputChange}
          value={formData.name}
          placeholder="Enter file name"
        />
      </Modal>
    </Layout>
  );
};

export default EditorPage;
