import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Avatar from "react-avatar";
import axios from "axios";
import "../App.css"; // Adjusted CSS path

const Profile = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const userID = localStorage.getItem("userID");
        const response = await axios.get(
          BACKEND_URL+`/api/user/profile/${userID}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch profile data");
      }
    };

    getProfileData();
  }, []);

  // TO RESTRICT UNAUTHENTICATED LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Toaster />
      <div className="container mt-5 profile-container">
        {profileData ? (
          <div className="profile-card">
            <div className="profile-header">
              <Avatar
                className="profile-avatar"
                name={profileData.user.name}
                size="100"
                round={true}
              />
              <h1>Welcome, {profileData.user.name}!</h1>
              <p>@{profileData.user.username}</p>
            </div>
            <div className="profile-details">
              <div className="metric-card">
                <h3>Workspace Count</h3>
                <p>{profileData.workspaceCount}</p>
              </div>
              <div className="metric-card">
                <h3>Folder Count</h3>
                <p>{profileData.folderCount}</p>
              </div>
              <div className="metric-card">
                <h3>File Count</h3>
                <p>{profileData.fileCount}</p>
              </div>
              <div className="metric-card">
                <h3>Total Lines of Code</h3>
                <p>{profileData.totalLoc}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
