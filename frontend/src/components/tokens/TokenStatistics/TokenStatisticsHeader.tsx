import SelectDepartment from '../common/SelectDepartment';

interface TokenStatisticsHeaderProps {
  selectedDepartment: number;
  setSelectedDepartment: (departmentsId: number | undefined) => void;
}

const TokenStatisticsHeader = ({ setSelectedDepartment }: TokenStatisticsHeaderProps) => {
  return (
    <header className="flex flex-col token-content">
      <div className="flex flex-row justify-between">
        <p className="text-gray-300 dark:text-white font-samsung font-bold">Department</p>

        <div className="w-[70%]">
          <SelectDepartment setSelectedDepartment={setSelectedDepartment} />
        </div>
      </div>
    </header>
  );
};

export default TokenStatisticsHeader;
