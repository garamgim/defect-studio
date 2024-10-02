import TokenHeader from '../components/tokens/TokenHeader/TokenHeader';
import TokenIssurance from '../components/tokens/TokenIssurance/TokenIssurance';
import TokenDistribution from '../components/tokens/TokenDistribution/TokenDistribution';
import TokenStatistics from '../components/tokens/TokenStatistics/TokenStatistics';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useGetMyInfo } from '@hooks/user/useGetMyInfo';

const Tokens = () => {
  const { myInfo, myInfoPending, myInfoLoading, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: !!localStorage.getItem('accessToken')
  });

  if (myInfoPending || myInfoLoading) {
    return <div>Loading...</div>;
  }

  if (isGetMyInfoError) {
    return <div>Error: {myInfoError?.message}</div>;
  }

  const items: TabsProps['items'] = [
    { key: '1', label: 'Token Issurance', children: <TokenIssurance />, disabled: myInfo?.role !== 'super_admin' },
    {
      key: '2',
      label: 'Token Distribution',
      children: <TokenDistribution />,
      disabled: myInfo?.role !== 'super_admin' && myInfo?.role !== 'department_admin'
    },
    { key: '3', label: 'Token Statistics', children: <TokenStatistics /> }
  ];

  const defaultActiveKey = myInfo?.role === 'super_admin' ? '1' : myInfo?.role === 'department_admin' ? '2' : '3';

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full overflow-y-auto custom-scrollbar dark:bg-gray-600 dark:border-none">
        <TokenHeader />
        <hr className="border-[#E6E6E6] dark:border-gray-700" />

        <section>
          <Tabs defaultActiveKey={defaultActiveKey} items={items} />
        </section>
      </div>
    </div>
  );
};

export default Tokens;
