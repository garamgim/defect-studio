import { useState } from 'react';
import SearchDepartments from '../TokenIssurance/SearchDepartments';

const TokenStatistics = () => {
  const [departmentsId, setDepartmentsId] = useState<number[]>([]);
  return (
    <section className="flex flex-col justify-center align-middle">
      <SearchDepartments departmentsId={departmentsId} setDepartmentsId={setDepartmentsId} />
    </section>
  );
};

export default TokenStatistics;
