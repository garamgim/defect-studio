import { useGetMyInfo } from '@hooks/user/useGetMyInfo';
import PersonStatisticSection from './PersonStatisticSection';

const DepartmentPersonStatistics = () => {
  // 내 정보
  const { myInfo, myInfoPending, myInfoLoading, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: localStorage.getItem('accessToken') !== null
  });

  return (
    <section>
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
