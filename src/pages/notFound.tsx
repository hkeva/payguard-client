// NotFound.tsx
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="text-center p-12 bg-white shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button
          type="primary"
          className="mt-8 w-full py-3 text-lg"
          onClick={goHome}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
