import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import React from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { IoTrashBinOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // State variables for managing modal visibility and workspace data
  const [showModal, setShowModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspace, setWorkspace] = useState([]);

  // Function to handle opening the modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setWorkspaceName("");
    setShowModal(false);
  };

  // Function to handle adding a new workspace
  const addWorkspace = async () => {
    const id = localStorage.getItem("userID");
    try {
      const response = await axios.post(
        "https://code-craft-pro.onrender.com:3001/api/workspace/add",
        {
          name: workspaceName,
          userID: id,
        }
      );
      if (response.data.status === "Success") {
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
    try {
      const userID = localStorage.getItem("userID");
      const response = await fetch(
        `https://code-craft-pro.onrender.com:3001/api/workspace/get/${userID}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();
      setWorkspace(res.userWorkspaces);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteWorkspace = async (id) => {
    try {
      const response = await fetch(
        `https://code-craft-pro.onrender.com:3001/api/workspace/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
      getWorkspaces();
      console.log(res);
    } catch (error) {
      console.log(error);
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
      <Navbar />
      <Toaster />
      <div>
        <div className="px-12 flex justify-between w-full">
          <h1 className="text-lg text-xl font-semibold">💼 Workspaces</h1>
          <button
            className="bg-blue-500 px-4 py-2 rounded-md text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onClick={openModal}
          >
            + Add Workspace
          </button>
        </div>
      </div>
      {workspace?.length > 0 ? (
        <div className="grid grid-cols-5 px-8 gap-4 mt-8">
          {workspace?.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-md shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">{item.name}</h1>
                <h1
                  className="text-red-500 text-lg hover:cursor-pointer"
                  onClick={() => {
                    deleteWorkspace(item._id);
                  }}
                >
                  <IoTrashBinOutline />
                </h1>
              </div>
              <Link to={`/editor/${item._id}`}><button className="px-4 mt-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                Open Workspace
              </button></Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="items-center justify-center w-full flex h-[60vh]">
          No workspaces available
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
