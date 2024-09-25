import { useQuery } from '@tanstack/react-query'; // React Query
import { AxiosResponse } from 'axios'; // Axios Response Type
import { getTokenUsage } from '@api/statistic_person'; // API
import { TokenUsage } from '@/types/statistics'; // Response Type
import MemberTokenUsageGraph from './MemberTokenUsageGraph';

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
    select: (response) =>
      response.data.sort((a, b) => new Date(a.usage_date).getTime() - new Date(b.usage_date).getTime()),
    staleTime: 1000 * 60 * 30, // 유효 시간 : 30분
    gcTime: 1000 * 60 * 60 // 가비지 컬렉터 시간 : 1시간
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