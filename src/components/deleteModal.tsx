import React from "react";
import { Modal, Button, Divider } from "antd";

interface DetailsModalProps {
  onClose: () => void;
  onConfirm: (id: string) => void;
  id: string;
  open: boolean;
}

const DeleteModal: React.FC<DetailsModalProps> = ({
  onClose,
  onConfirm,
  id,
  open,
}) => {
  const handleOk = () => {
    onConfirm(id);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Confirm Deletion"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" danger onClick={handleOk}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this item?</p>
      <Divider />
    </Modal>
  );
};

export default DeleteModal;
