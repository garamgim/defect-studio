import { DailyImageCount } from '@/types/statistics'; // Resoponse Data Type
import { getDailyImageCount } from '@api/statistic_person'; // API Function
import { useQuery } from '@tanstack/react-query'; // React Query
import { AxiosResponse } from 'axios'; // Axios Response Type
import MeberImageUsageGraph from './MeberImageUsageGraph';

interface MemberImageUsageProps {
  member_id: number;
}

const MemberImageUsage = ({ member_id }: MemberImageUsageProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<DailyImageCount[]>,
    Error,
    DailyImageCount[],
    (string | number)[]
  >({
    queryKey: ['dailyImageCount', member_id],
    queryFn: () => getDailyImageCount(member_id),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 30, // 유효 시간 : 30분
    gcTime: 1000 * 60 * 60 // 가비지 컬렉터 시간 : 1시간
  });

  return (
    <div>
      {isPending && <div>Loading...</div>}
      {isError && <div>{error.message || 'Something went wrong'}</div>}
      {data && <MeberImageUsageGraph data={data} />}
    </div>
  );
};

export default MemberImageUsage;
