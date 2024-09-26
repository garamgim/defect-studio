import { DailyImageCount } from '@/types/statistics'; // Resoponse Data Type
import { getDailyImageCount } from '@api/statistic_person'; // API Function
import { useQuery } from '@tanstack/react-query'; // React Query
import { AxiosResponse } from 'axios'; // Axios Response Type
import MemberImageUsageGraph from './MeberImageUsageGraph';

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
    queryKey: ['dailyImageCount', 'person', member_id],
    queryFn: () => getDailyImageCount(member_id),
    select: (response) => response.data
    // staleTime: 1000 * 60 * 30, // 유효 시간 : 30분
    // gcTime: 1000 * 60 * 60 // 가비지 컬렉터 시간 : 1시간
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
      {data && data.length > 0 && <MemberImageUsageGraph data={data} />}
    </div>
  );
};

export default MemberImageUsage;
