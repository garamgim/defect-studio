import { useQuery } from '@tanstack/react-query'; // React Query
import { AxiosResponse } from 'axios'; // Axios Response Type
import { getDepartmentToolFrequency } from '@/api/statistic_department'; // API Call
import { ToolFrequency } from '@/types/statistics'; // Type
import DepartmentToolUsageGraph from './DepartmentToolUsageGraph';

interface DepartmentToolUsageProps {
  department_id: number;
}

const DepartmentToolUsage = ({ department_id }: DepartmentToolUsageProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<ToolFrequency[]>,
    Error,
    ToolFrequency[],
    (string | number)[]
  >({
    queryKey: ['ToolUsage', 'department', department_id],
    queryFn: () => getDepartmentToolFrequency(department_id),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 30, // 유효 시간 : 30분
    gcTime: 1000 * 60 * 60 // 가비지 컬렉터 시간 : 1시간
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
      {data && data.length > 0 && <DepartmentToolUsageGraph data={data} />}
    </div>
  );
};

export default DepartmentToolUsage;