import SearchDepartments from '../common/SearchDepartments';

interface TokenStatisticsHeaderProps {
  selectedDepartment: number;
  setSelectedDepartment: (departmentsId: number[]) => void;
}

const TokenStatisticsHeader = ({ selectedDepartment, setSelectedDepartment }: TokenStatisticsHeaderProps) => {
  return (
    <header className="flex flex-col token-content">
      <div className="flex flex-row justify-between">
        <p className="text-gray-300 dark:text-white font-samsung font-bold">Department</p>

        <div className="w-[70%]">
          <SearchDepartments
            isMultiSelect={false}
            departmentsId={selectedDepartment}
            setDepartmentsId={setSelectedDepartment}
          />
        </div>
      </div>
    </header>
  );
};

export default TokenStatisticsHeader;
