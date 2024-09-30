import { useQuery } from '@tanstack/react-query'; // React Query
import { AxiosResponse } from 'axios'; // Axios Response Type
import { getTokenUsage } from '@api/statistic_person'; // API
import { TokenUsage } from '@/types/statistics'; // Response Type
import { calculateTotal } from '@/utils/MemberTokenUsageTotalCalculator'; // Total 계산
import MemberTokenUsageGraph from './MemberTokenUsageGraph';
import { staleTime, gcTime } from '../../common/constance';

interface MemberTokenUsageProps {
  member_id: number;
}

const MemberTokenUsage = ({ member_id }: MemberTokenUsageProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<TokenUsage[]>,
    Error,
    TokenUsage[],
    (string | number)[]
  >({
    queryKey: ['TokenUsage', 'person', member_id],
    queryFn: () => getTokenUsage(member_id),
    select: (response) => {
      const totalRes = calculateTotal(response.data); // Total 계산
      // 날짜 순으로 정렬
      return [...response.data, ...totalRes].sort((a, b) => {
        if (a.usage_date < b.usage_date) return -1;
        if (a.usage_date > b.usage_date) return 1;
        return 0;
      });
    },
    staleTime,
    gcTime
  });
  return (
    <div>
      {isPending && <div>Loading...</div>}
      {isError && <div>{error.message || 'Something went wrong'}</div>}
      {data && data.length === 0 && (
        <div className="flex flex-col justify-center align-middle items-center w-full">
          <p className="text-[24px] font-bold">No Data</p>
          <p className="text-[20px]">Try again later</p>
        </div>
      )}
      {data && data.length > 0 && <MemberTokenUsageGraph data={data} />}
    </div>
  );
};

export default MemberTokenUsage;
