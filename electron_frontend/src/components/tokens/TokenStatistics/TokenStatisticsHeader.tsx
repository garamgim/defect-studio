import { Select } from 'antd';
import SearchDepartments from '../common/SearchDepartments';
const TokenStatisticsHeader = () => {
  return (
    <header className="flex flex-col token-content">
      <div className="flex flex-row justify-between">
        <p className="text-gray-300 dark:text-white font-samsung font-bold">Department</p>

        <div className="w-[70%]">
          <SearchDepartments isMultiSelect={false} />
        </div>
      </div>
    </header>
  );
};

export default TokenStatisticsHeader;
