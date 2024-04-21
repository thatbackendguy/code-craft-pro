import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
  PiFilesThin,
  PiFoldersThin,
  PiLaptopThin,
  PiCodeLight,
} from "react-icons/pi";
import axios from "axios";
import Avatar from "react-avatar";
import "../App.css";
import Loader from "../components/Loader";
import Chart from "chart.js/auto";

const Profile = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [profileData, setProfileData] = useState(null);
  const [lineChart, setLineChart] = useState(null);
  const [fileChart, setFileChart] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const userID = localStorage.getItem("userID");
        const response = await axios.get(
          BACKEND_URL + `/api/user/profile/${userID}`
        );

        if (response.data.status === "success") {
          setProfileData(response.data);
          destroyChartInstances();
          createLineChart(response.data);
          createFileChart(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProfileData();

    // Cleanup function to destroy chart instances
    return () => {
      destroyChartInstances();
    };
  }, []);

  // TO RESTRICT UNAUTHENTICATED LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  const destroyChartInstances = () => {
    if (lineChart) {
      lineChart.destroy();
    }
    if (fileChart) {
      fileChart.destroy();
    }
  };

  const createLineChart = (data) => {
    const ctx = document.getElementById("line-chart");
    const labels = Object.keys(data.lines);
    const values = Object.values(data.lines);
    const backgroundColors = generateRandomColors(labels.length);

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Lines",
            data: values,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
    setLineChart(chart);
  };

  const createFileChart = (data) => {
    const ctx = document.getElementById("file-chart");
    const labels = data.folders.map((folder) => folder.name);
    const values = data.folders.map((folder) => folder.files.length);
    const backgroundColors = generateRandomColors(labels.length);

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Files",
            data: values,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
    setFileChart(chart);
  };

  const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
      colors.push(color);
    }
    return colors;
  };

  return (
    <div>
      <Navbar />
      <Toaster />
      <div className="w-full">
        {profileData ? (
          <div className="profile-card flex justify-center items-center w-full">
            <div>
              <div className="mt-20 gap-3 profile-header grid justify-center items-center w-full">
                <div className="text-center">
                  <Avatar
                    name={profileData.user.name}
                    size="100"
                    round={true}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-semi-bold ">
                    Welcome, {profileData.user.name}!
                  </h1>
                  <p className="text-center">@{profileData.user.username}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-center items-center w-full ">
                <div className="w-full gap-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2">
                  {/* WORKSPACE COUNT */}
                  <div className="border border-black-800 rounded-md p-4 grid justify-center items-center w-full">
                    <div className="grid justify-center items-center w-full">
                      {" "}
                      <PiLaptopThin className="text-[#007936] text-[60px]" />
                    </div>
                    <h3 className="font-bold">Workspace Count</h3>
                    <p className="text-center  text-gray-500">
                      {profileData.workspaceCount}
                    </p>
                  </div>

                  {/* FOLDER COUNT */}
                  <div className="border border-black-800 rounded-md p-4 grid justify-center items-center w-full ">
                    <div className="grid justify-center items-center w-full">
                      {" "}
                      <PiFoldersThin className="text-[#ff4d00] text-[60px]" />
                    </div>
                    <h3 className="font-bold">Folder Count</h3>
                    <p className="text-center  text-gray-500">
                      {profileData.folderCount}
                    </p>
                  </div>

                  {/* FILE COUNT */}
                  <div className="border border-black-800 rounded-md p-4 grid justify-center items-center w-full ">
                    <div className="grid justify-center items-center w-full">
                      {" "}
                      <PiFilesThin className="text-[#3c53ff] text-[60px]" />
                    </div>
                    <h3 className="font-bold ">File Count</h3>
                    <p className="text-center  text-gray-500">
                      {profileData.fileCount}
                    </p>
                  </div>

                  {/* LINES OF CODE */}
                  <div className="border border-black-800 rounded-md p-4 grid justify-center items-center w-full ">
                    <div className="grid justify-center items-center w-full">
                      {" "}
                      <PiCodeLight className="text-[#b3013b] text-[60px]" />
                    </div>
                    <h3 className="font-bold">Total Lines of Code</h3>
                    <p className="text-center text-gray-500">
                      {profileData.totalLoc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
      <div className="charts-container grid grid-cols-2 p-32 gap-24">
        <div className="chart">
          <h1 className="text-2xl font-semibold py-4">📊 File Line Count</h1>
          <div className="chart-container">
            <canvas id="line-chart" height={250} />
          </div>
        </div>

        <div className="chart">
          <h1 className="text-2xl font-semibold py-4">📊 File Count</h1>
          <div className="chart-container">
            <canvas id="file-chart" height={250} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
