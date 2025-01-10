import React, { useState } from "react";
import { Menu, Button } from "antd";
import {
  CreditCardOutlined,
  FileTextOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  onMenuClick: (key: string) => void;
  selectedKey: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick, selectedKey }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`bg-gray-800 text-white h-screen`}>
      <div className="flex items-center justify-between px-4 py-4 h-16">
        <div className={`${collapsed ? "hidden" : "text-xl font-semibold"}`}>
          Dashboard
        </div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
          className="text-white"
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        onClick={({ key }) => onMenuClick(key)}
        className={`${collapsed ? "w-20" : "w-64"}`}
      >
        <Menu.Item key="payments" icon={<CreditCardOutlined />}>
          Payments
        </Menu.Item>
        <Menu.Item key="documents" icon={<FileTextOutlined />}>
          Documents
        </Menu.Item>
        <Menu.Item key="users" icon={<UserOutlined />}>
          Users
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
