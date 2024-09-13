import { useForm } from 'react-hook-form';
import { login, upDateMyInfo } from '../../api/user';
import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface LoginFormInputs {
  username: string;
  password: string;
}

// 로그인 폼의 onSubmit 함수
const onSubmit = async (
  data: LoginFormInputs,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  navigate: (path: string) => void
) => {
  try {
    const response = await login(data);
    console.log(response);
    message.success('Login successful');
    await upDateMyInfo();
    setErrorMessage(''); // 에러 메시지 초기화
    navigate('/'); // 홈 화면 이동
  } catch (error) {
    console.error('Login error:', error);
    setErrorMessage('Login failed. Please try again later.');
    message.error('Login failed. Try again later.');
  }
};

// 로그인 폼 컴포넌트
const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <>
      <form onSubmit={handleSubmit((data) => onSubmit(data, setErrorMessage, navigate))}>
        {/* Username 입력 */}
        <input
          type="text"
          id="username"
          {...register('username', { required: true })}
          className="mt-3 mb-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Username"
          required
        />
        {/* Password 입력 */}
        <input
          type="password"
          id="password"
          {...register('password', { required: true })}
          className="mt-1 mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Password"
          autoComplete="off"
          required
        />
        {/* Submit 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[400px] h-[50px] rounded-[100px] bg-[#6200ea] text-lg font-black text-white"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      </form>
    </>
  );
};

export default LoginForm;
