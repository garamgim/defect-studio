import { memo } from 'react';
import './TokenTabs.css';

export interface TabItemType {
  id: string;
  name: string;
  value: number | string;
}

interface TokenTabsProps {
  activeTab: string | number;
  setActiveTab: React.Dispatch<React.SetStateAction<string | number>>;
  tabItems: TabItemType[];
}

// activeTab : 현재 선택된 탭의 value
// setActiveTab : 현재 선택된 탭의 value를 변경하는 함수 - useState or useReducer
// tabItems : 탭의 정보를 담은 배열 : TabItemType[]

const TokenTabs = ({ activeTab, setActiveTab, tabItems }: TokenTabsProps) => {
  return (
    <div className="mb-4 border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab">
        {tabItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveTab(item.value)}
              className={`token-tab-default ${activeTab === item.value ? 'token-tab-active' : 'token-tab-inactive'} `}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(TokenTabs);
