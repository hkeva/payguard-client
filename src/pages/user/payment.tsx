import { useState, useEffect } from "react";
import { Form, Input, Button, message, Table, Spin } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import {
  useCreatePaymentMutation,
  useGetPaymentByUserQuery,
} from "../../api/paymentsApi";
import { getStatusTag } from "../../utils/utils";
import DetailsModal from "../../components/detailsModal";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const UserPayment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    title: "",
    amount: 0,
  });

  const [createPayment] = useCreatePaymentMutation();
  const { data: tableData, isLoading: isListLoading } =
    useGetPaymentByUserQuery({
      userId: JSON.parse(localStorage.getItem("user") || "{}")._id,
    });

  const handleSubmit = async (values: { title: string; amount: number }) => {
    setLoading(true);
    try {
      const response = await createPayment({
        title: values.title,
        amount: values.amount.toString(),
      }).unwrap();

      const stripe: any = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        message.error(error.message);
      }
    } catch (error: any) {
      if (error.status === 400) message.error(error.data.message);
      else message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
      form.resetFields();
      setPaymentData({ title: "", amount: 0 });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const success = urlParams.get("success");

    if (sessionId && success === "true") {
      message.success("Payment Successful!");
    } else if (sessionId && success === "false") {
      message.error("Payment Failed");
    }

    // Remove the query parameters from the URL
    if (window.history.replaceState) {
      const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handleOpenModal = (record: any) => {
    setModalData(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalData(null);
  };

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

  return (
    <>
      <div>
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-4">
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input
                placeholder="Enter payment title"
                value={paymentData.title}
                onChange={(e) =>
                  setPaymentData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Form.Item>

            <Form.Item
              name="amount"
              rules={[
                { required: true, message: "Please enter the amount" },
                {
                  validator: (_, value) => {
                    if (value && value <= 0) {
                      return Promise.reject(
                        new Error("Amount must be a positive number")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter payment amount"
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    amount: +e.target.value,
                  }))
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={`w-full py-2 text-white font-semibold rounded-lg`}
              >
                Pay Now
              </Button>
            </Form.Item>
          </Form>
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
            loading={isListLoading}
            title={() => <div className="font-bold text-lg">Your Payments</div>}
            className="max-w-[900px] mx-auto text-sm overflow-auto border border-gray-200 rounded shadow-sm p-4 mt-4"
            style={{ maxHeight: "calc(100vh - 450px)" }}
          />
        )}
      </div>
      {isModalVisible && (
        <DetailsModal
          onClose={handleCloseModal}
          data={modalData}
          type={"payment"}
        />
      )}
    </>
  );
};

export default UserPayment;
