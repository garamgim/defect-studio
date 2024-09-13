import TokenHeader from '../components/tokens/TokenHeader/TokenHeader';
import { useMemo, useState } from 'react';
import TokenTabs from '../components/tokens/TokenTabs/TokenTabs';
import { TabItemType } from '../components/tokens/TokenTabs/TokenTabs';
import TokenIssurance from '../components/tokens/TokenIssurance/TokenIssurance';
import TokenDistribution from '../components/tokens/TokenDistribution/TokenDistribution';
import TokenStatistics from '../components/tokens/TokenStatistics/TokenStatistics';

const tabItems: TabItemType[] = [
  { id: 'TokenIssurance', name: 'Token Issurance', value: 1 },
  { id: 'TokenDistribution', name: 'Token Distribution', value: 2 },
  { id: 'TokenStatistics', name: 'Token Statistics', value: 3 }
];

const Tokens = () => {
  // Tab Items
  const [activeTab, setActiveTab] = useState<string | number>('');
  const memorizedSetActiveTab = useMemo(() => setActiveTab, []);
  // //유저 정보 읽어오고 나서 권한 정보 읽어오기 -> 추후 수정
  // useEffect(() => {
  //   setActiveTab("");
  // }, []);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full overflow-y-auto custom-scrollbar dark:bg-gray-600 dark:border-none">
        <TokenHeader />
        <hr className="border-[#E6E6E6] dark:border-gray-700" />

        <TokenTabs activeTab={activeTab} setActiveTab={memorizedSetActiveTab} tabItems={tabItems} />
        <section>
          {activeTab === 1 && (
            <div>
              <TokenIssurance />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <TokenDistribution />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <TokenStatistics />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Tokens;
