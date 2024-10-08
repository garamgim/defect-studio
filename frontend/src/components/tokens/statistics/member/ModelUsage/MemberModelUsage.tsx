import { useQuery } from '@tanstack/react-query'; // React Query
import { AxiosResponse } from 'axios'; // Axios Response Type
import { getModelFrequency } from '@api/statistic_person'; // API
import { ModelFrequency } from '@/types/statistics'; // Response Type
import MemberModelUsageGraph from './MemberModelUsageGraph';
import { staleTime, gcTime } from '../../common/constance';

interface MemberModelUsageProps {
  member_id: number;
}

const MemberModelUsage = ({ member_id }: MemberModelUsageProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<ModelFrequency[]>,
    Error,
    ModelFrequency[],
    (string | number)[]
  >({
    queryKey: ['ModelUsage', 'person', member_id],
    queryFn: () => getModelFrequency(member_id),
    select: (response) =>
      response.data.filter((item, index) => {
        return !!item.model && item.model.length > 0 && item.usage > 0 && index < 10;
      }),
    staleTime,
    gcTime
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
      {data && data.length > 0 && <MemberModelUsageGraph data={data} />}
    </div>
  );
};

export default MemberModelUsage;
