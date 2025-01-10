import { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useLoginMutation, useRegisterMutation } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const getAccessToken = () => {
  const urlHash = window.location.hash;
  const params = new URLSearchParams(urlHash.slice(1));
  const accessToken = params.get("access_token");
  return accessToken;
};

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const accessToken = getAccessToken();
  const [isRegister, setIsRegister] = useState(false);

  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const toggleForm = () => {
    form.resetFields();
    setIsRegister(!isRegister);
  };
  useEffect(() => {
    if (accessToken) message.success("Your email has been confirmed!");
  }, []);

  const handleSubmit = async (values: {
    name?: string;
    email: string;
    password: string;
  }) => {
    try {
      if (isRegister) {
        await register(values).unwrap();
        message.success("Registered successfully! Please confirm you email");
        setIsRegister(false);
      } else {
        await login(values).unwrap();
        const response = await login(values).unwrap();

        if (response.user?.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error: unknown) {
      const err = error as { data: { message: string; error: string } };
      message.error(err.data.message || err.data.error || "An error occurred");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("sessionExpired")) {
      localStorage.removeItem("sessionExpired");

      setTimeout(() => {
        message.warning("Session expired. Please log in again.");
      }, 1000);
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card
        className="w-[400px] mx-6"
        title={<Title level={3}>{isRegister ? "Register" : "Login"}</Title>}
      >
        <Form
          form={form}
          name="auth_form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          {isRegister && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please input a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={isRegister ? isRegisterLoading : isLoginLoading}
            >
              {isRegister ? "Register" : "Login"}
            </Button>
          </Form.Item>

          <Form.Item className="text-center">
            <a onClick={toggleForm}>
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
