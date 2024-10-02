import { useEffect } from 'react';
import { useGetMyInfo } from '@hooks/user/useGetMyInfo';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import GuestUserList from '../components/userManagement/GuestUserList';

import { TabsProps, Tabs } from 'antd';
import UserList from '@/components/userManagement/UserList';

const items: TabsProps['items'] = [
  { key: 'Guest User Management', label: 'Guest Management', children: <GuestUserList /> },
  { key: 'User Management', label: 'User Management', children: <UserList /> }
];

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
              <h2 className="text-[24px] font-bold">User Management</h2>
              <p>You can management Guest or Aleady User signed up</p>
            </header>
            <Tabs items={items} />
          </>
        )}
      </div>
    </div>
  );
};

export default GuestUserUpdate;
