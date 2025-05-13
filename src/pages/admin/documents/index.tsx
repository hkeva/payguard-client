import { useState } from "react";
import {
  Table,
  Button,
  Select,
  Space,
  Popconfirm,
  Tag,
  message,
  Tooltip,
  Input,
  Image,
  Pagination,
} from "antd";
import { STATUS } from "../../../constants/constant";
import {
  useGetDocumentListQuery,
  useUpdateDocumentStatusMutation,
} from "../../../api/documentApi";
import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import UserDetailsModal from "../../../components/userDetailsModal";

const { Option } = Select;

const getStatusTag = (status: string) => {
  switch (status) {
    case STATUS.PENDING:
      return <Tag color="volcano">{status}</Tag>;
    case STATUS.APPROVED:
      return <Tag color="green">{status}</Tag>;
    case STATUS.REJECTED:
      return <Tag color="red">{status}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const DocumentTable = () => {
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isFetching } = useGetDocumentListQuery(filters);
  console.log("data ", data && data.meta.total);
  const [updateDocumentStatus] = useUpdateDocumentStatusMutation();
  const [isShowUserDetails, setShowUserDetails] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const handleFilterChange = (value: string, key: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAction = async (action: string, record: { _id: string }) => {
    try {
      await updateDocumentStatus({ id: record._id, status: action }).unwrap();

      message.success(`Document status updated!`);
    } catch (error: unknown) {
      const err = error as { data: { message: string; error: string } };
      message.error(err.data.message || "An error occurred");
    }
  };

  const handleResetFilter = () => {
    setFilters({
      title: "",
      status: "",
      page: 1,
      limit: 10,
    });
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      message.success("Copied!");
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "File URL",
      dataIndex: "fileUrl",
      key: "fileUrl",
      render: (text: string) => {
        const isImage = /.(jpg|jpeg|png|gif|bmp|webp)$/i.test(text);
        return (
          <div className="flex items-center space-x-2 max-w-[250px] truncate">
            {isImage ? (
              <Image
                width={80}
                height={80}
                src={text}
                className="rounded-[5%] object-cover"
              />
            ) : (
              <a
                href={text}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Open file
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Created by",
      dataIndex: "userId",
      key: "userId",
      render: (userId: { _id: string; email: string }) => (
        <div className="flex items-center space-x-2">
          <span
            className="cursor-pointer text-blue-500"
            onClick={() => handleUserDetailsModalOpen(userId._id)}
          >
            {userId.email}
          </span>

          <Tooltip title="Copy to clipboard" color={"#60a5fa"}>
            <CopyOutlined
              className="text-blue-500 cursor-pointer"
              onClick={() => copyToClipboard(userId.email)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Uploaded At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD h:mm A"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD h:mm A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: { _id: string; status: string }) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure you want to approve this payment?"
            onConfirm={() => handleAction(STATUS.APPROVED, record)}
            disabled={record.status === STATUS.APPROVED}
          >
            <Button
              className="bg-blue-400 text-white"
              disabled={record.status === STATUS.APPROVED}
            >
              Approve
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to reject this payment?"
            onConfirm={() => handleAction(STATUS.REJECTED, record)}
            disabled={record.status === STATUS.REJECTED}
          >
            <Button
              className="bg-red-400 text-white"
              disabled={record.status === STATUS.REJECTED}
            >
              Reject
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUserDetailsModalClose = () => {
    setShowUserDetails(false);
    setCurrentUserId("");
  };

  const handleUserDetailsModalOpen = (userId: string) => {
    setShowUserDetails(true);
    setCurrentUserId(userId);
  };

  const onPageChange = (page: number) => {
    setFilters({
      ...filters,
      page: page,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 w-full flex flex-wrap justify-center gap-4">
        <Input
          placeholder="Search by title"
          value={filters.title}
          onChange={(e) => handleFilterChange(e.target.value, "title")}
          prefix={<SearchOutlined />}
          className="w-full sm:w-48"
        />
        <Select
          defaultValue=""
          value={filters.status}
          onChange={(value) => handleFilterChange(value, "status")}
          className="w-full sm:w-48"
        >
          <Option value="">All Status</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
          <Option value="pending">Pending</Option>
        </Select>
        <Button onClick={handleResetFilter} className="w-full sm:w-auto">
          Reset
        </Button>
      </div>

      <div className="flex justify-center">
        <Pagination
          defaultCurrent={1}
          total={data ? data.meta.total : null}
          onChange={onPageChange}
        />
      </div>

      <Table
        columns={columns}
        pagination={false}
        rowKey="key"
        className="overflow-y-auto max-h-[calc(100vh-200px)] p-4 rounded-lg shadow-sm"
        dataSource={data?.data || []}
        loading={isLoading || isFetching}
      />

      {isShowUserDetails && (
        <UserDetailsModal
          userId={currentUserId}
          onClose={handleUserDetailsModalClose}
        />
      )}
    </div>
  );
};

export default DocumentTable;
