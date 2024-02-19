import { useState, useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import Navbar from "../components/Navbar";

import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

import { Breadcrumb, Layout, Menu as AntMenu, theme, Modal, Input, Button } from "antd";

import axios from "axios";
import { useLocation } from "react-router-dom";
import { VscNewFolder,VscFolder, VscNewFile } from "react-icons/vsc";
const { Header, Content, Sider } = Layout;

const EditorPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [code, setCode] = useState("");
  const editorRef = useRef(null);
  console.log(code);
  const handledEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const getEditorValue = () => {
    setCode(editorRef?.current?.getValue());
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
    name: '',
});
const [selectedFolderId, setSelectedFolderId] = useState(null);

  // CODE
  
  const getFoldersFromServer = async () => {
    try {
      // Access the last segment

      const response = await fetch(
        `http://localhost:3000/api/folder/get-all/${workspaceID}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();

      console.log(res);

      setWorkspaceName(res.workspaceName);
      setData(res.folders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const items2 = data?.map((folder, index) => {
    const key = `sub${index + 1}`;

    return {
      key: key,
      icon: React.createElement(VscFolder), // Assuming you want the same icon for all folders
      label: (
        <div onClick={() => handleFolderClick(folder._id)}>{folder.name}</div>
      ),

      children: folder.files.map((file, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: file,
        };
      }),
    };
  });


  const handleInputChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value
    });
};


  // TO RESTRICT UNAUTHENTICATED LOGIN
  useEffect(() => {
    getFoldersFromServer();
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  const handleAddFolder = () => {
    setShowAddFolderModal(true);
  };

  const handleAddFolderSubmit = async() => {
    //console.log(formData.name, localStorage.getItem("userID"))

    try {
      
      const response = await axios.post(
        `http://localhost:3000/api/folder/add/${workspaceID}`,
        {
          'name': formData.name,
          'userID':localStorage.getItem("userID")}
      );


      if(response?.data?.status==="Success") {
        getFoldersFromServer();
      }
      
    } catch (error) {
      console.log(error);
    }
    
    setShowAddFolderModal(false);
  };

  const handleAddFile = () => {
    setShowAddFileModal(true);
  };

  const handleAddFileSubmit = async() => {
    

    try {
      
      const response = await axios.post(
        `http://localhost:3000/api/file/add/${selectedFolderId}`,
        {
          'name': formData.name,
          'userID':localStorage.getItem("userID"),
          'workspaceID': workspaceID
        }
      );


      if(response?.data?.status==="Success") {
        getFoldersFromServer();
      }
      
    } catch (error) {
      console.log(error);
    }

    setShowAddFileModal(false);
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="pt-5">
        <Sider
          width={200}
          style={{ background: colorBgContainer }}
          className="rounded-md"
        >
          <div className="w-full flex justify-between items-center p-4 bg-gray-200 rounded-md">
                <h1>{workspaceName}</h1>
                <h1 className="flex items-center">
                  <VscNewFile onClick={handleAddFile} className="hover:cursor-pointer"/>
                  <VscNewFolder className="hover:cursor-pointer ml-2" onClick={handleAddFolder} />
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
            <Editor
              height="80vh"
              width="100%"
              theme="vs-dark"
              defaultLanguage="javascript"
              onChange={getEditorValue}
              onMount={handledEditorDidMount}
              options={{
                fontSize: "20px",
              }}
            />
          </Content>
        </Layout>
      </Layout>
      <Modal
        title="Add Folder"
        visible={showAddFolderModal}
        onCancel={() => setShowAddFolderModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowAddFolderModal(false)} className="cancel-button-model-workspace">
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddFolderSubmit} className="bg-blue-500 text-white">
            Submit
          </Button>,
        ]}
      >
        <Input id="name" onChange={handleInputChange} value={formData.name} placeholder="Enter folder name" />
      </Modal>

      {/* FILE INPUT MODAL */}
      <Modal
        title="Add File"
        visible={showAddFileModal}
        onCancel={() => setShowAddFileModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowAddFileModal(false)} className="cancel-button-model-workspace">
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddFileSubmit} className="bg-blue-500 text-white">
            Submit
          </Button>,
        ]}
      >
        <Input id="name" onChange={handleInputChange} value={formData.name} placeholder="Enter file name" />
      </Modal>
    </Layout>
  );
};

export default EditorPage;
