import { MemberImageCount } from '@/types/statistics';
import { getDepartmentMemberImageCount } from '@/api/statistic_department';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import DepartmentImageUsageGraph from './DepartmentImageUsageGraph';

interface DepartmentImageUsageProps {
  department_id: number;
}

const DepartmentImageUsage = ({ department_id }: DepartmentImageUsageProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<MemberImageCount[]>,
    Error,
    MemberImageCount[],
    (string | number)[]
  >({
    queryKey: ['departmentMemberImageCount', department_id],
    queryFn: () => getDepartmentMemberImageCount(department_id),
    select: (response) => response.data
  });

  return (
    <div className="flex flex-col text-black dark:text-white">
      {isPending && <div>Loading...</div>}
      {isError && <div>{error.message || 'Something went wrong'}</div>}
      {data && data.length === 0 && (
        <div className="flex flex-col justify-center align-middle items-center w-full">
          <p className="text-[24px] font-bold">No Data</p>
          <p className="text-[20px]">Try again later</p>
        </div>
      )}
      {data && data.length > 0 && <DepartmentImageUsageGraph data={data} />}
    </div>
  );
};

export default DepartmentImageUsage;
