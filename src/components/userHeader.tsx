import React from "react";
import { Tabs, Dropdown, Avatar, Divider } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  CreditCardOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

interface UserHeaderProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-white pt-5 pl-5 pr-5 pb-0">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">User Dashboard</div>

        <Dropdown
          menu={{
            items: [
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Logout",
                onClick: handleLogout,
              },
            ],
          }}
          trigger={["click"]}
          className="cursor-pointer"
        >
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      </div>
      <Divider className="my-2 border-blue-500 border-opacity-80" />
      <div className="flex justify-center items-center">
        <Tabs
          activeKey={activeTab}
          defaultActiveKey="1"
          onChange={onTabChange}
          className="w-[210px]"
        >
          <TabPane
            tab={
              <span>
                <CreditCardOutlined /> Payments
              </span>
            }
            key="1"
          />
          <TabPane
            tab={
              <span>
                <FileOutlined /> Documents
              </span>
            }
            key="2"
          />
        </Tabs>
      </div>
    </div>
  );
};

export default UserHeader;
