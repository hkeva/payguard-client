import React, { useState } from "react";
import { Layout } from "antd";
import UserHeader from "../../components/userHeader";
import UserPayment from "./payment";
import UserDocument from "./document";

const { Content } = Layout;

const UserDashboard: React.FC = () => {
  const savedTab = localStorage.getItem("activeTab");
  const [activeTab, setActiveTab] = useState<string>(savedTab || "1");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    localStorage.setItem("activeTab", key);
  };

  return (
    <Layout className="w-full h-screen">
      <UserHeader onTabChange={handleTabChange} />

      <Content className="px-5 flex-1 max-h-[calc(100vh-131px)] overflow-y-auto">
        {activeTab === "1" && <UserPayment />}
        {activeTab === "2" && <UserDocument />}
      </Content>
    </Layout>
  );
};

export default UserDashboard;
