import React from "react";
import { Modal, Divider, Tag } from "antd";
import { useGetUserByIdQuery } from "../api/userApi";

interface DetailsModalProps {
  onClose: () => void;
  userId: any;
}

const UserDetailsModal: React.FC<DetailsModalProps> = ({ onClose, userId }) => {
  const { data, isLoading } = useGetUserByIdQuery({ userId });

  return (
    <Modal
      title="User Details"
      open
      onCancel={onClose}
      footer={null}
      width={600}
      loading={isLoading}
    >
      <Divider />
      <p className="mt-2">
        <strong>Name:</strong> {data && data.data[0].name}
      </p>
      <p className="mt-2">
        <strong>Email:</strong> {data && data.data[0].email}
      </p>
      <p className="mt-2">
        <strong>Is Admin:</strong>{" "}
        {data && (
          <Tag color={data.data[0].isAdmin ? "green" : "red"}>
            {data.data[0].isAdmin ? "Yes" : "No"}
          </Tag>
        )}
      </p>
    </Modal>
  );
};

export default UserDetailsModal;
