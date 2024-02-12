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

import { Breadcrumb, Layout, Menu as AntMenu, theme } from "antd";

import axios from "axios";
const { Header, Content, Sider } = Layout;

const fn = async () => {
  try {

    const response = await fetch("http://localhost:3000/api/editor/123/456/789", {
      method: "GET",
    });
    const res = await response.json()
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
fn();

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const items1 = navLinks.map(({ name, href }) => ({
  key: name.toLowerCase(),
  label: name,
  href,
}));

const items2 = [HomeOutlined, HomeOutlined, HomeOutlined].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `Folder ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `File${subKey}`,
      };
    }),
  };
});

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

  // TO RESTRICT UNAUTHENTICATED LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
    }
  });

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout className="pt-5">
        <Sider width={200} style={{ background: colorBgContainer }}>
          <AntMenu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={items2}
          />
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
    </Layout>
  );
};

export default EditorPage;