import { DepartmentMemberTokenUsage } from '@/types/statistics';
import { getDepartmentMembersTokenUsage } from '@api/statistic_department';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import TokenUsageGraph from './TokenUsageGraph';
interface TokenUsageProps {
  department_id: number;
}

const TokenUsage = ({ department_id }: TokenUsageProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<DepartmentMemberTokenUsage[]>,
    Error,
    DepartmentMemberTokenUsage[],
    (string | number)[]
  >({
    queryKey: ['departmentMembersTokenUsage', department_id],
    queryFn: () => getDepartmentMembersTokenUsage(department_id),
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
      {data && data.length > 0 && <TokenUsageGraph data={data} />}
    </div>
  );
};
export default TokenUsage;
