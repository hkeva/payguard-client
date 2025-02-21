import { useRef, useState } from "react";
import { supabase } from "../../config/supabase";
import {
  useCreateDocumentMutation,
  useGetDocumentByUserQuery,
} from "../../api/documentApi";
import { message, Spin, Table } from "antd";
import DetailsModal from "../../components/detailsModal";
import { getStatusTag } from "../../utils/utils";

const UserDocument: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <a
          onClick={() => handleOpenModal(record)}
          className="text-blue-500 underline"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
  ];

  const [createDocument, { isLoading }] = useCreateDocumentMutation();
  const { data: tableData, isLoading: isListLoading } =
    useGetDocumentByUserQuery({
      userId: JSON.parse(localStorage.getItem("user") || "{}")._id,
    });

  const handleOpenModal = (record: any) => {
    setModalData(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalData(null);
  };

  // File size limit (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const beforeUpload = (file: File) => {
    const isFileValid = file.size <= MAX_FILE_SIZE;
    if (!isFileValid) {
      setFileError("File must be smaller than 5MB!");
    }
    return isFileValid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileError("");
      if (beforeUpload(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setTitleError("");
  };

  const handleFileUpload = async () => {
    if (!title || !file) {
      if (!title) {
        setTitleError("Title is required!");
      }
      if (!file) {
        setFileError("Please select a file!");
      }
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // upload file to supabase
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        message.error("Document could not be created!");
        setUploading(false);
        return;
      }

      const { data } = await supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      if (data.publicUrl) {
        const documentDetails = {
          title,
          fileUrl: data.publicUrl,
        };

        try {
          await createDocument(documentDetails).unwrap();
          message.success("Document created successfully!");
        } catch (error: any) {
          if (error.status == 400) message.error(error.data.message);
          else message.error("Document could not be created!");
        }
      }
    } catch {
      message.error("Document could not be created!");
    } finally {
      setTitle("");
      setFile(null);
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <div>
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-4">
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter document title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {titleError && (
              <p className="text-red-500 text-sm !mt-[2px]">{titleError}</p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg file:cursor-pointer file:border-0 file:bg-blue-500 file:text-white file:px-4 file:py-2 hover:file:bg-blue-600"
            />
            {fileError && (
              <p className="text-red-500 text-sm !mt-[2px]">{fileError}</p>
            )}

            <div>
              <button
                onClick={handleFileUpload}
                disabled={uploading || isLoading}
                className={`w-full py-2 text-white font-semibold rounded-lg ${
                  uploading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {uploading || isLoading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>
        </div>

        {/* table */}
        {isListLoading && (
          <div className="flex justify-center mt-[30px]">
            <Spin />
          </div>
        )}
        {tableData && (
          <Table
            columns={columns}
            dataSource={tableData.data || []}
            pagination={false}
            title={() => (
              <div className="font-bold text-lg">Your Documents</div>
            )}
            className="max-w-[900px] mx-auto text-sm overflow-auto border border-gray-200 rounded shadow-sm p-4 mt-4"
            style={{ maxHeight: "calc(100vh - 450px)" }}
          />
        )}
      </div>
      {isModalVisible && (
        <DetailsModal
          onClose={handleCloseModal}
          data={modalData}
          type={"document"}
        />
      )}
    </>
  );
};

export default UserDocument;
