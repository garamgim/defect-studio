import { useGetMyInfo } from '@/api/user';
import PersonStatisticSection from './PersonStatisticSection';

// interface DepartmentPersonStatisticsProps {
//   departmentId: number;
// }

// interface SelectOptionType {
//   key: number;
//   value: number;
//   label: string;
//   name: string;
//   nickname: string;
// }

const DepartmentPersonStatistics = () => {
  // 내 정보
  const { myInfo, myInfoPending, myInfoLoading, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: localStorage.getItem('accessToken') !== null
  });

  // // 선택된 사람
  // const [selectedMember, setSelectedMember] = useState<number | undefined>(undefined);

  // // 부서 내 사람들 목록 불러오기
  // const { data, isPending, isError, error } = useQuery<
  //   AxiosResponse<DepartmentPersonType[]>,
  //   Error,
  //   SelectOptionType[],
  //   (string | number)[]
  // >({
  //   queryKey: ['department_people', departmentId],
  //   queryFn: () => getDepartmentPeople(departmentId),
  //   select: (data) =>
  //     data.data.map((item) => ({
  //       key: item.member_id,
  //       name: item.name,
  //       nickname: item.nickname,
  //       value: item.member_id,
  //       label: `${item.name} : ${item.nickname}`
  //     }))
  // });

  // 에러 날 경우 아에 에러 메시지 출력 , 로딩중 표시
  // if (isError) {
  //   return <div>Error: {error?.message}</div>;
  // } else if (isPending) {
  //   return <div>Loading...</div>;
  // }

  return (
    <section>
      {/* <div>
        <Select
          className="w-full mt-3"
          showSearch
          placeholder="Select a person"
          filterOption={(input, option) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
          options={data}
          labelRender={(props) => {
            return (
              <div>
                <span>{props.label}</span>
              </div>
            );
          }}
          value={selectedMember}
          onChange={(value) => setSelectedMember(value)}
          optionRender={(option) => (
            <Space>
              <span>
                {option.data.name} : {option.data.nickname}
              </span>
            </Space>
          )}
        />
      </div> */}

      <div className="token-content mt-3">
        {
          // 선택된 사람이 있을 경우
          myInfo && <PersonStatisticSection member_id={myInfo.member_id} />
        }
        {isGetMyInfoError && <div>Error: {myInfoError?.message || 'Something Went Wrong'}</div>}
        {(myInfoPending || myInfoLoading) && <div>Loading...</div>}
      </div>
    </section>
  );
};

export default DepartmentPersonStatistics;
