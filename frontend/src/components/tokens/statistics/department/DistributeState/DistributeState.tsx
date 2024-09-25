import { getDepartmentTokenDistributionState } from '@/api/statistic_department'; // API
import { useQuery } from '@tanstack/react-query';
import { TokenDistribution } from '@/types/statistics'; // Response Type
import { AxiosResponse } from 'axios';
import DistributeStateGraph from './DistributeStateGraph';

interface DistributeStateProps {
  department_id: number;
}

const DistributeState = ({ department_id }: DistributeStateProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<TokenDistribution[]>,
    Error,
    TokenDistribution[],
    (string | number)[]
  >({
    queryKey: ['departmentDistributeState', department_id],
    queryFn: () => getDepartmentTokenDistributionState(department_id),
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
      {data && data.length > 0 && <DistributeStateGraph data={data} />}
    </div>
  );
};

export default DistributeState;
