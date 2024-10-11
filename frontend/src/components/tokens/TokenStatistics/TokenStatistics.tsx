import React, { useState } from 'react';
import SelectDepartment from '../common/SelectDepartment';
const StatisticSection = React.lazy(() => import('./StatisticSection'));

const TokenStatistics = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>(); // 선택된 부서, 단 1개 혹은 선택없음
  return (
    <article className="flex flex-col justify-center align-middle">
      <SelectDepartment setSelectedDepartment={setSelectedDepartment} />
      <div className="token-content mt-3">
        {selectedDepartment ? (
          <StatisticSection departmentId={selectedDepartment} />
        ) : (
          <div>Please Select the Department</div>
        )}
      </div>
    </article>
  );
};

export default TokenStatistics;
