import React from "react";
import { Tabs } from "antd";
import Dashboard from "../pages/Dashboard";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SharedDashboard from "../pages/SharedDashboard";
const WorkspaceTabs = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: <h1 className="text-xl">💼 Workspaces</h1>,
      children: <Dashboard showModal={showModal} closeModal={closeModal} />,
    },
    {
      key: "2",
      label: <h1 className="text-xl">👥 Shared Workspaces</h1>,
      children: <SharedDashboard />,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="justify-between flex w-full">
        <Tabs className="py-4 px-12 w-full" defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
};
export default WorkspaceTabs;
