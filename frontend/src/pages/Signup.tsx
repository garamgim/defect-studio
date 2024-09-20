import { Form, Input, Button, message, Select } from 'antd';
import { signUpFormType } from '../types/user';
import { signupHTTP } from '../api/signupHTTP';
import { useNavigate } from 'react-router-dom';
import { getAllDepartments } from '../api/department';
import { useQuery } from '@tanstack/react-query';
import { departmentType } from '../api/department';
import { AxiosResponse } from 'axios';

const initialValues: signUpFormType = {
  login_id: '',
  password: '',
  name: '',
  nickname: '',
  email: '',
  department_id: 0
};

const Signup = () => {
  const navigate = useNavigate();
  // 제출 코드
  const onSubmit = async (data: signUpFormType) => {
    console.log(data);
    try {
      await signupHTTP(data);
      form.resetFields();
      message.success('Your registration request has been completed. Please contact the administrator for approval.');
      navigate('/login');
    } catch (error) {
      message.error('Failed to sign up. Please try again later.');
    }
  };

  // 부서 정보 가져오기
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<departmentType[]>,
    Error,
    departmentType[],
    (string | number)[]
  >({
    queryKey: ['departments'],
    queryFn: getAllDepartments,
    select: (data) => data.data
  });

  const [form] = Form.useForm();

  // 조건부 렌더링
  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="w-full h-full min-h-[1024px] relative overflow-hidden bg-white dark:bg-gray-800">
      <p className="absolute left-1/2 top-8 transform -translate-x-1/2 text-2xl sm:text-3xl font-black text-center text-black dark:text-white">
        Welcome to Defect Studio
      </p>
      <section className="absolute top-[100px] left-1/2 transform -translate-x-1/2">
        <Form
          form={form}
          onFinish={onSubmit}
          layout="vertical"
          style={{ width: '90%', minWidth: '400px' }}
          initialValues={initialValues}
        >
          <Form.Item
            label="Login ID"
            name="login_id"
            rules={[
              { required: true, message: 'Login ID is required' },
              { min: 3, message: 'Login ID must be at least 3 characters' },
              { max: 16, message: 'Login ID must be at most 16 characters' },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: 'Login ID can only contain letters and numbers'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 8, message: 'Password must be at least 8 characters' },
              { max: 20, message: 'Password must be at most 20 characters' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/,
                message: 'Password must include alphabet, number Each'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Name is required' },
              { max: 15, message: 'Name must be at most 15 characters' },
              {
                pattern: /^[a-zA-Z0-9가-힣]+$/,
                message: 'Name can only contain letters, numbers, and Korean characters'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nickname"
            name="nickname"
            rules={[
              { required: true, message: 'Nickname is required' },
              { max: 15, message: 'Nickname must be at most 15 characters' },
              {
                pattern: /^[a-zA-Z0-9가-힣]+$/,
                message: 'Nickname can only contain letters, numbers, and Korean characters'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email address' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department_id"
            rules={[
              { required: true, message: 'Please Select Department' },
              {
                validator: (_, value) => {
                  if (value === 0) {
                    return Promise.reject('Please Select Department');
                  }
                  return Promise.resolve();
                }
              }
            ]}
            initialValue={1}
          >
            <Select>
              <Select.Option value={0} disabled={true}>
                Select Department
              </Select.Option>
              {data.map((department) => (
                <Select.Option key={department.department_id} value={department.department_id}>
                  {department.department_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              className="w-[100] min-w-[400px] my-5 max-w-[400px] h-[53px] rounded-[10px] bg-[#6200ea] text-lg font-black text-center text-white focus:outline-none"
            >
              Request Signup
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
};

export default Signup;
