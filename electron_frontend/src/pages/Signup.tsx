import { Form, Input, Button, Select, message } from "antd";
import { signUpFormType } from "../types/user";
import { signupHTTP } from "../api/signupHTTP";
import { useNavigate } from "react-router-dom";

const initialValues: signUpFormType = {
  login_id: "defaultLoginID",
  password: "",
  name: "defaultName",
  nickname: "defaultNickname",
  email: "default@example.com",
  role: "department_member",
  department_id: 0,
};

const Signup = () => {
  const navigate = useNavigate();
  const onSubmit = async (data: signUpFormType) => {
    console.log(data);
    try {
      await signupHTTP(data);
      form.resetFields();
      message.success("Successfully signed up. Try logging in now.");
      navigate("/login");
    } catch (error) {
      message.error("Failed to sign up. Please try again later.");
    }
  };

  const [form] = Form.useForm();
  return (
    <div className="w-full h-full min-h-[1024px] relative overflow-hidden bg-white">
      <p className="absolute left-1/2 top-8 transform -translate-x-1/2 text-2xl sm:text-3xl font-black text-center text-black">
        Welcome to Defect Studio
      </p>
      <section className="absolute top-[100px] left-1/2 transform -translate-x-1/2">
        <Form
          form={form}
          onFinish={onSubmit}
          layout="vertical"
          style={{ width: "90%", minWidth: "400px" }}
          initialValues={initialValues}
        >
          <Form.Item
            label="Login ID"
            name="login_id"
            rules={[
              { required: true, message: "Login ID is required" },
              { min: 3, message: "Login ID must be at least 3 characters" },
              { max: 16, message: "Login ID must be at most 16 characters" },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: "Login ID can only contain letters and numbers",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
              { max: 20, message: "Password must be at most 20 characters" },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#![\]]).{8,}$/,
                message:
                  "Password must include alphabet, numbers, and special characters #![]",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required" },
              { max: 15, message: "Name must be at most 15 characters" },
              {
                pattern: /^[a-zA-Z0-9가-힣]+$/,
                message:
                  "Name can only contain letters, numbers, and Korean characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nickname"
            name="nickname"
            rules={[
              { required: true, message: "Nickname is required" },
              { max: 15, message: "Nickname must be at most 15 characters" },
              {
                pattern: /^[a-zA-Z0-9가-힣]+$/,
                message:
                  "Nickname can only contain letters, numbers, and Korean characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select>
              <Select.Option value="department_member">
                Department Member
              </Select.Option>
              <Select.Option value="department_admin">
                Department Admin"
              </Select.Option>
              <Select.Option value="super_admin">Super Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Department ID"
            name="department_id"
            rules={[{ required: true, message: "Department ID is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              className="w-[100] min-w-[400px] my-5 max-w-[400px] h-[53px] rounded-[100px] bg-[#6200ea] text-lg font-black text-center text-white focus:outline-none"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
};

export default Signup;
