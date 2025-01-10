import { Tag } from "antd";
import { STATUS } from "../constants/constant";

export const getStatusTag = (status: string) => {
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
