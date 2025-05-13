import { useState } from "react";
import { Table, Input, Button, Tag, Row, Col, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useGetUserListQuery } from "../../../api/userApi";
import dayjs from "dayjs";

const UserTable = () => {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isFetching } = useGetUserListQuery(filters);
  console.log("data =>", data && data.meta.total);
  const handleFilterChange = (value: string, key: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilter = () => {
    setFilters({
      name: "",
      email: "",
      page: 1,
      limit: 10,
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Is Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? "green" : "red"}>{isAdmin ? "Yes" : "No"}</Tag>
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
  ];

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
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => handleFilterChange(e.target.value, "name")}
          prefix={<SearchOutlined />}
          className="w-full sm:w-48"
        />
        <Input
          placeholder="Search by email"
          value={filters.email}
          onChange={(e) => handleFilterChange(e.target.value, "email")}
          className="w-full sm:w-48"
        />
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

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Table
            columns={columns}
            pagination={false}
            rowKey="key"
            className="overflow-y-auto max-h-[calc(100vh-200px)] p-4 rounded-lg shadow-sm"
            dataSource={data?.data || []}
            loading={isLoading || isFetching}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UserTable;
