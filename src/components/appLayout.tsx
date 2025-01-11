import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import CustomHeader from "./header";
import DocumentTable from "../pages/admin/documents";
import UserTable from "../pages/admin/users";
import PaymentTable from "../pages/admin/payments";
import { useNavigate } from "react-router-dom";

const AppLayout = () => {
  const navigate = useNavigate();
  const savedSelectedKey = localStorage.getItem("selectedKey") || "payments";
  const [selectedKey, setSelectedKey] = useState(savedSelectedKey);

  useEffect(() => {
    localStorage.setItem("selectedKey", selectedKey);
  }, [selectedKey]);

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
  };

  const handleUserLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar onMenuClick={handleMenuClick} selectedKey={selectedKey} />
      <div className="w-full">
        <CustomHeader
          title={selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}
          onLogout={handleUserLogout}
        />

        {/* Admin dashboard body */}
        {selectedKey === "payments" ? (
          <PaymentTable />
        ) : selectedKey === "documents" ? (
          <DocumentTable />
        ) : selectedKey === "users" ? (
          <UserTable />
        ) : null}
      </div>
    </div>
  );
};

export default AppLayout;
