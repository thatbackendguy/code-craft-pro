import { useState, useEffect } from "react";

import React from "react";

import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { LuUsers2 } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import Avatar from "react-avatar";

const SharedDashboard = () => {
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

  const getWorkspaces = async () => {
    setSharedWorkspaceLoading(true);

    try {
      const userID = localStorage.getItem("userID");
      const response = await fetch(
        BACKEND_URL+`/api/workspace/shared-with-me/${userID}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();
      setWorkspace(res.user.sharedWithMe);
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error)
    }
    setSharedWorkspaceLoading(false);
  };



  const getSharedWorkspaces = async (workspaceID) => {
    try {
      const response = await fetch(
        BACKEND_URL+`/api/workspace/share/${workspaceID}`,
        {
          method: "GET",
        }
      );
      const res = await response.json();

      setSharedWorkspaces(res.workspace.sharedWith);
    } catch (error) {
      console.log(error);
      toast.error(error)
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
      {workspace?.length > 0 ? (
        <div className="grid grid-cols-5 px-8 gap-4 mt-8">
          {workspace?.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-md shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">{item.name}</h1>
              </div>

              <div className="flex items-center justify-between w-full">
                <Link to={`/editor/${item._id}`}>
                  <button className="px-4 mt-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600">
                    Open Workspace
                  </button>
                </Link>

                <h1
                  className="bg-blue-500 text-white rounded-md p-2 mt-4 hover:bg-blue-600 hover:cursor-pointer"
                  onClick={() => openShareModal(item._id)}
                >
                  <LuUsers2 />
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
              <h2 className="text-lg font-semibold mb-4">Shared With</h2>{" "}
              <h1
                className="hover:cursor-pointer text-[22px]"
                onClick={closeShareModal}
              >
                <RxCross2 />
              </h1>
            </div>

            <div>
              {sharedWorkspaceLoading ? (
                <h1>Loading...</h1>
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
    </div>
  );
};

export default SharedDashboard;
