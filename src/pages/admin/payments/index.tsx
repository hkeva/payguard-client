import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Space,
  Popconfirm,
  message,
  Tooltip,
  Pagination,
} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  useDeletePaymentMutation,
  useGetPaymentListQuery,
  useUpdatePaymentStatusMutation,
} from "../../../api/paymentsApi";
import { STATUS } from "../../../constants/constant";
import { IPayment } from "../../../types";
import { generateInvoicePDF } from "../../../utils/generatePdf";
import dayjs from "dayjs";
import { getStatusTag } from "../../../utils/utils";
import UserDetailsModal from "../../../components/userDetailsModal";
import DeleteModal from "../../../components/deleteModal";

const { Option } = Select;

const PaymentTable = () => {
  const [filters, setFilters] = useState({
    title: "",
    amount: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isFetching } = useGetPaymentListQuery(filters);
  const [deletePayment, { isLoading: isDeleteLoading }] =
    useDeletePaymentMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [isShowUserDetails, setShowUserDetails] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [selectedIdForDeletion, setSelectedIdForDeletion] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleFilterChange = (value: string, key: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAction = async (action: string, record: IPayment) => {
    try {
      await updatePaymentStatus({ id: record._id, status: action }).unwrap();

      message.success(`Payment status updated!`);
    } catch (error: unknown) {
      const err = error as { data: { message: string; error: string } };
      message.error(err.data.message || err.data.error || "An error occurred");
    }
  };

  const handleResetFilter = () => {
    setFilters({
      title: "",
      amount: "",
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

  const handleInvoiceDownload = (record: IPayment) => {
    generateInvoicePDF(record._id, record.title, record.amount, record.status);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
      title: "Created At",
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
      render: (_: unknown, record: IPayment) => (
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
          <Tooltip title="Download Invoice" color={"#60a5fa"}>
            <Button
              className="bg-blue-50"
              icon={<DownloadOutlined />}
              onClick={() => handleInvoiceDownload(record)}
            />
          </Tooltip>
          <Tooltip title="Delete" color="#f87171">
            <Button
              className="bg-red-50 hover:bg-red-100 text-red-600"
              icon={<DeleteOutlined className="text-red-600" />}
              onClick={() => onDeleteModalOpen(record._id)}
            />
          </Tooltip>
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

  const onDeleteModalOpen = (id: string) => {
    setDeleteModalOpen(true);
    setSelectedIdForDeletion(id);
  };

  const onConfirmDelete = async (id: string) => {
    setDeleteModalOpen(false);
    setSelectedIdForDeletion("");

    try {
      await deletePayment({ id }).unwrap();
      message.success("Payment deleted successfully");
    } catch {
      message.error("Failed to delete payment");
    }
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
        <Input
          placeholder="Search by amount"
          value={filters.amount}
          onChange={(e) => handleFilterChange(e.target.value, "amount")}
          className="w-full sm:w-48"
          type="number"
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

      <div className="mb-6 flex justify-center">
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
        loading={isLoading || isFetching || isDeleteLoading}
      />

      {isShowUserDetails && (
        <UserDetailsModal
          userId={currentUserId}
          onClose={handleUserDetailsModalClose}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          id={selectedIdForDeletion}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={(id) => onConfirmDelete(id)}
        />
      )}
    </div>
  );
};

export default PaymentTable;
