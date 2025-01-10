import React from "react";
import { Layout, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

interface CustomHeaderProps {
  title: string;
  onLogout: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onLogout }) => {
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={onLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="flex justify-between items-center p-4 bg-white shadow-md w-full">
      <div className="text-xl font-semibold">{title}</div>
      <div>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Avatar icon={<UserOutlined />} className="cursor-pointer" />
        </Dropdown>
      </div>
    </Header>
  );
};

export default CustomHeader;
