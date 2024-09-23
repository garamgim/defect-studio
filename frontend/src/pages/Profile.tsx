import { useNavigate } from 'react-router-dom';
import { useGetMyInfo } from '../api/user';
import { Button } from 'antd';
const Profile = () => {
  // 자기 정보 가져오기
  const { myInfo, myInfoPending, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: !!localStorage.getItem('accessToken')
  });
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
        <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full overflow-y-auto custom-scrollbar dark:bg-gray-600 dark:border-none text-black dark:text-white font-samsung">
          {myInfoPending && <p>Loading...</p>}
          {isGetMyInfoError && <p>Error: {myInfoError?.message}</p>}

          {/* 여기서부터 프로필 정보 가져오기 */}
          {myInfo && (
            <div>
              {/* 프로필 헤더 */}
              <p className="text-3xl text-left mb-8 font-bold">{myInfo.nickname}'s Profile</p>

              {/* 다른 세부정보 */}
              <section className="flex items-center justify-between mb-8 relative w-full">
                <div className="w-full">
                  <div className="relative w-[100%] mb-4">
                    <p className="text-base text-left  mb-1">Department</p>
                    <div className="w-full h-10 p-2 border border-[#3A3A5A] dark:border-slate-200 rounded-lg">
                      <p className="text-base text-left w-[100%] ">{myInfo.department_name}</p>
                    </div>
                  </div>
                  <div className="relative w-[100%] mb-4">
                    <p className="text-base text-left  mb-1">Email</p>
                    <div className="w-full h-10 p-2 border border-[#3A3A5A] dark:border-slate-200 rounded-lg">
                      <p className="text-base text-left w-[100%] ">{myInfo.email}</p>
                    </div>
                  </div>
                  <div className="relative w-[100%] mb-4">
                    <p className="text-base text-left  mb-1">Authority</p>
                    <div className="w-full h-10 p-2 border border-[#3A3A5A] dark:border-slate-200 rounded-lg">
                      <p className="text-base text-left w-[100%] ">{myInfo.role}</p>
                    </div>
                  </div>
                </div>
              </section>
              {/* 기타 버튼*/}

              {/* 비밀번호 변경 */}
              <section className="w-full flex flex-row">
                <Button className="font-samsung font-bold ">Change Password</Button>
              </section>

              {/* 수정 삭제 */}
              <section className="flex flex-row justify-end">
                <Button
                  onClick={() => {
                    navigate('edit');
                  }}
                  className="mx-3"
                >
                  Edit
                </Button>
                <Button className="mx-3">Delete</Button>

                {myInfo.role === 'super_admin' && (
                  <Button
                    className="mx-3"
                    onClick={() => {
                      navigate('/guestUserManage');
                    }}
                  >
                    Set Guest User
                  </Button>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
