import { useGetMyInfo } from '../api/user';
import { Button } from 'antd';
const Profile = () => {
  const { myInfo, myInfoPending, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: !!localStorage.getItem('accessToken')
  });

  return (
    <div>
      <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-700 p-4 overflow-hidden">
        <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full overflow-y-auto custom-scrollbar">
          {myInfoPending && <p>Loading...</p>}
          {isGetMyInfoError && <p>Error: {myInfoError?.message}</p>}

          {myInfo && (
            <div>
              {/* 프로필 헤더 */}
              <p className="text-3xl text-black text-left mb-8">Profile</p>
              <section className="flex items-center justify-between mb-8 relative">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <svg
                    width={141}
                    height={141}
                    viewBox="0 0 141 141"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-4 md:mb-0"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M139 70.5C139 108.332 108.332 139 70.5 139C32.6685 139 2 108.332 2 70.5C2 32.6685 32.6685 2 70.5 2C108.332 2 139 32.6685 139 70.5Z"
                      fill="#C4C4C4"
                      stroke="#8A2BE2"
                      stroke-width={4}
                    />
                  </svg>
                  <div className="ms-8">
                    <p className="text-xl text-left text-black">Nickname</p>
                    <p className="text-base text-left text-black mt-2">{myInfo.nickname}</p>
                    {/* <p className="text-xl text-left text-black mt-4">Name</p>
                  <p className="text-base text-left text-black mt-2">{myInfo.name}</p> */}
                  </div>
                </div>
              </section>

              {/* 다른 세부정보 */}
              <section className="flex items-center justify-between mb-8 relative">
                <div>
                  <div className="relative w-full mb-4">
                    <p className="text-base text-left text-black mb-1">Department</p>
                    <div className="w-full h-10 p-2 border border-[#3A3A5A] rounded-lg">
                      <p className="text-base text-left text-black w-[80vw] ">{myInfo.department_name}</p>
                    </div>
                  </div>
                  <div className="relative w-full mb-4">
                    <p className="text-base text-left text-black mb-1">Email</p>
                    <div className="w-full h-10 p-2 border border-[#3A3A5A] rounded-lg">
                      <p className="text-base text-left text-black ">{myInfo.email}</p>
                    </div>
                  </div>
                  <div className="relative w-full mb-4">
                    <p className="text-base text-left text-black mb-1">Role</p>
                    <div className="w-full h-10 p-2 border border-[#3A3A5A] rounded-lg">
                      <p className="text-base text-left text-black">{myInfo.role}</p>
                    </div>
                  </div>
                </div>
              </section>
              {/* 기타 버튼*/}
              <section className="flex flex-row justify-end">
                <Button className="mx-3">Edit</Button>
                <Button className="mx-3">Delete</Button>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
