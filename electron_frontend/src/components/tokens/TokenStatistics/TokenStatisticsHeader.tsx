import { Select } from 'antd';

const TokenStatisticsHeader = () => {
  return (
    <header className="flex flex-col token-content">
      <div className="flex flex-row justify-between">
        <p className="text-gray-300 dark:text-white font-samsung font-bold">Department</p>

        <Select
          style={{ width: '80%' }}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        />
      </div>
      <div className="flex flex-row justify-between mt-3">
        <p className="text-gray-300 dark:text-white font-samsung font-bold">Person</p>

        <Select
          style={{ width: '80%' }}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        />
      </div>
    </header>
  );
};

export default TokenStatisticsHeader;
