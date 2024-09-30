import { Input, DatePicker } from 'antd';
import { Dayjs } from 'dayjs';
const { RangePicker } = DatePicker;

interface SearchFilterProps {
  searchId: string;
  setSearchId: (value: string) => void;
  searchPrompt: string;
  setSearchPrompt: (value: string) => void;
  searchDates: [Dayjs | null, Dayjs | null] | null;
  setSearchDates: (dates: [Dayjs | null, Dayjs | null] | null) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchId,
  setSearchId,
  searchPrompt,
  setSearchPrompt,
  searchDates,
  setSearchDates
}) => (
  <div className="flex flex-col w-full mb-6 space-y-4 mb-[40px]">
    <div className="flex flex-col md:flex-row items-center w-full space-y-4 md:space-y-0 md:space-x-4">
      {/* Search by ID */}
      <div className="flex-grow w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by ID</label>
        <Input
          placeholder="Enter Folder ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md"
        />
      </div>

      {/* Search by Prompt */}
      <div className="flex-grow w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by Prompt</label>
        <Input
          placeholder="Enter prompt"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md"
        />
      </div>

      {/* Date Range */}
      <div className="flex-grow w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
        <RangePicker
          value={searchDates}
          onChange={setSearchDates}
          className="w-full p-2 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-none"
          placeholder={['Start Date', 'End Date']}
        />
      </div>
    </div>
  </div>
);

export default SearchFilter;
