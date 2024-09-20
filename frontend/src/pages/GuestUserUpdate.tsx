import { useEffect } from 'react';
import { useGetMyInfo } from '../api/user';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const GuestUserUpdate = () => {
  const navigate = useNavigate();
  const { myInfo, myInfoPending, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: !!localStorage.getItem('accessToken')
  });

  //   로그인 결과, myInfo가 존재하고, role이 super_admin이 아닌 경우, 권한이 없다는 메시지를 띄우고, 이전으로 이동
  useEffect(() => {
    if (myInfo && myInfo.role !== 'super_admin') {
      message.warning('You are not authorized to access this page');
      navigate('..');
    }
  }, [myInfo]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full overflow-y-auto custom-scrollbar dark:bg-gray-600 dark:border-none text-black dark:text-white">
        {myInfoPending && <p>Loading...</p>}
        {isGetMyInfoError && <p>Error: {myInfoError?.message || 'Something went Wrong. Try again later'}</p>}
        {myInfo && myInfo.role === 'super_admin' && (
          <>
            <header>
              <h1 className="text-[30px] font-bold mb-2 dark:text-gray-300">Guest User Management</h1>
              <p className="mb-2 dark:text-gray-300">Please approve or reject the registration request. </p>
            </header>
            <main></main>
          </>
        )}
      </div>
    </div>
  );
};

export default GuestUserUpdate;
