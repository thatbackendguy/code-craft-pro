import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { LuUserPlus2 } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import Avatar from "react-avatar";
import Loader from "../components/Loader";
import { FaPlus } from "react-icons/fa";
import { Tooltip } from "antd";
const Dashboard = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // State variables for managing modal visibility and workspace data
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspace, setWorkspace] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [emailToShare, setEmailToShare] = useState("");
  const [workspaceID, setWorkspaceID] = useState();
  const [sharedWorkspaces, setSharedWorkspaces] = useState();
  const [sharedWorkspaceLoading, setSharedWorkspaceLoading] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // Function to handle opening the modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setWorkspaceName("");
    setShowModal(false);
  };

  const openShareModal = (id) => {
    setWorkspaceID(id);
    setShowShareModal(true);
    getSharedWorkspaces(id);
  };

  const closeShareModal = () => {
    setEmailToShare("");
    setShowShareModal(false);
    setSharedWorkspaces([]);
  };

  // Function to handle adding a new workspace
  const addWorkspace = async () => {
    const id = localStorage.getItem("userID");
    try {
      const response = await axios.post(BACKEND_URL + "/api/workspace/add", {
        name: workspaceName,
        userID: id,
      });

      setLoading(false);
      if (response.data.status === "success") {
        getWorkspaces();
        toast.success(response.data.message);
      }
    } catch (e) {
      console.log(e);
    }
    // Close the modal after adding the workspace
    closeModal();
  };

  const getWorkspaces = async () => {
    setSharedWorkspaceLoading(true);

    try {
      const userID = localStorage.getItem("userID");
      const response = await fetch(
        BACKEND_URL + `/api/workspace/get/${userID}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();
      setWorkspace(res.userWorkspaces);
      setLoading(false);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
    setSharedWorkspaceLoading(false);
  };

  const deleteWorkspace = async (id) => {
    try {
      const response = await fetch(
        BACKEND_URL + `/api/workspace/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
// console.log(res);
      if (res.status === "success") {
        toast.success(res.message);
        setLoading(false);
        getWorkspaces();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSharedWorkspaces = async (workspaceID) => {
    try {
      const response = await fetch(
        BACKEND_URL + `/api/workspace/share/${workspaceID}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();
      setLoading(false);
      // console.log(res);

      // console.log(res.workspace.sharedWith);

      setSharedWorkspaces(res.workspace.sharedWith);
    } catch (error) {
      console.log(error);
    }
  };

  const shareWorkspace = async () => {
    try {
      const userID = localStorage.getItem("userID");
      const response = await axios.post(
        BACKEND_URL + `/api/workspace/share/${workspaceID}`,
        {
          guestEmailID: emailToShare,
          ownerUserID: userID,
        }
      );
      setLoading(false);
      if (response.data.status === "success") {
        getSharedWorkspaces(workspaceID);
        toast.success(response.data.message);
      }
      // console.log(response);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const removeFromSharedWorkspace = async (guestEmailID) => {
    try {
      const userID = localStorage.getItem("userID");
      const response = await axios.post(
        BACKEND_URL + `/api/workspace/share/delete/${workspaceID}`,
        {
          guestEmailID,
          ownerUserID: userID,
        }
      );
      setLoading(false);
      if (response.data.status === "success") {
        getSharedWorkspaces(workspaceID);
        toast.success(response.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  // TO RESTRICT UNAUTHENTICATED LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");

    getWorkspaces();
    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  return (
    <div className="">
      <Toaster />
      <div className="">
        <div className="px-12 flex justify-between w-full">
          <div></div>
          <div className="items-center flex">
            <Tooltip title="Add Workspace">
            <button
              className="bg-blue-500 p-5 rounded-full text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 z-[100] bottom-10 right-10 fixed"
              onClick={openModal}
            >
              <FaPlus className="text-2xl"/>
            </button>
              </Tooltip>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : workspace?.length > 0 ? (
        <div className="grid grid-cols-5 px-8 gap-4 mt-8">
          {workspace?.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-[30px]  bg-[#f3f3f3] p-6"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">{item.name}</h1>
                <h1
                  className="text-red-500 text-lg hover:cursor-pointer"
                  onClick={() => {
                    deleteWorkspace(item._id);
                  }}
                >
                  <MdDeleteOutline className="text-2xl mr-[3px]"/>
                </h1>
              </div>

              <div className="flex items-center justify-between w-full">
                <Link to={`/editor/${item._id}`}>
                  <button className="px-6 mt-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600">
                    Open
                  </button>
                </Link>

                <h1
                  className=" text-blue-500 rounded-full mt-4 hover:cursor-pointer"
                  onClick={() => openShareModal(item._id)}
                >
                  <LuUserPlus2 className="text-2xl" />
                </h1>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="items-center justify-center w-full flex h-[60vh]">
          No workspaces available
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg w-[40vw] shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-4">Share Workspace</h2>{" "}
              <h1
                className="hover:cursor-pointer text-[22px]"
                onClick={closeShareModal}
              >
                <RxCross2 />
              </h1>
            </div>

            <input
              type="email"
              placeholder="Enter email to share"
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={emailToShare}
              onChange={(e) => setEmailToShare(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md text-gray-800 mr-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                onClick={closeShareModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
                onClick={() => {
                  shareWorkspace();
                }}
              >
                Share
              </button>
            </div>

            <div>
              <h1 className="py-4 font-semi-bold text-lg">Shared With</h1>
              {sharedWorkspaceLoading ? (
                <Loader />
              ) : sharedWorkspaces?.length > 0 ? (
                <>
                  {sharedWorkspaces?.map((item, index) => {
                    return (
                      <div
                        className="flex justify-between w-full items-center"
                        key={index}
                      >
                        <div className="flex items-center">
                          <Avatar
                            className="profile-avatar"
                            name={item.name}
                            size="30"
                            round={true}
                          />
                          <h1 className="pl-3 py-2 font-bold">{item.name}</h1>
                        </div>

                        <div className="flex items-center">
                          <h1 className="text-gray-500 pr-3 ">{item.email}</h1>

                          <MdDeleteOutline
                            className="hover:cursor-pointer text-xl text-red-500"
                            onClick={() =>
                              removeFromSharedWorkspace(item.email)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <h1 className="flex justify-center items-center h-[60px] text-gray-500">
                  Not shared 🔒
                </h1>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding a new workspace */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg w-[20vw] shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Workspace</h2>
            <input
              type="text"
              placeholder="Enter workspace name"
              className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md text-gray-800 mr-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
                onClick={addWorkspace}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
