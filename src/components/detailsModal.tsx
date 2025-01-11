import React, { useState } from "react";
import { Modal, Button, Divider, Image, Spin } from "antd";
import dayjs from "dayjs";
import { getStatusTag } from "../utils/utils";

interface DetailsModalProps {
  onClose: () => void;
  data: any;
  type: "document" | "payment";
}

const DetailsModal: React.FC<DetailsModalProps> = ({ onClose, data, type }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const renderFilePreview = (fileUrl: string) => {
    const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") {
      return (
        <Button
          type="primary"
          onClick={() => window.open(fileUrl, "_blank")}
          className="mt-4"
        >
          Open File
        </Button>
      );
    }
    if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png"
    ) {
      return (
        <div className="mt-4">
          {loading && <Spin className="mt-1" size="small" />}
          <Image
            width={100}
            src={fileUrl}
            alt="Preview"
            preview={{ src: fileUrl }}
            onLoad={handleImageLoad}
            className={`rounded-lg ${loading ? "hidden" : "block"}`}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      title={data?.title}
      open
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Divider />
      <p className="mt-2">
        <strong>Status:</strong> {data?.status && getStatusTag(data.status)}
      </p>
      {type === "payment" && data?.amount && (
        <p className="mt-2">
          <strong>Amount:</strong> {data?.amount}TK
        </p>
      )}
      <p className="mt-2">
        <strong>Created At:</strong>{" "}
        {data?.createdAt && dayjs(data.createdAt).format("YYYY-MM-DD h:mm A")}
      </p>
      <p className="mt-2">
        <strong>Updated At:</strong>{" "}
        {data?.updatedAt && dayjs(data.updatedAt).format("YYYY-MM-DD h:mm A")}
      </p>
      {type === "document" && data?.fileUrl && renderFilePreview(data.fileUrl)}
    </Modal>
  );
};

export default DetailsModal;
