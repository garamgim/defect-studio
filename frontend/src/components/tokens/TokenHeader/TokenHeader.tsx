import { useGetMyInfo } from '@hooks/user/useGetMyInfo';

const TokenHeader = () => {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const { myInfo, myInfoPending, myInfoLoading, isGetMyInfoError } = useGetMyInfo({ isLoggedIn });

  if (myInfoPending || myInfoLoading) {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  } else if (isGetMyInfoError) {
    return (
      <div>
        <p>Error occurred while fetching user info</p>
        <p>Try again or Retry login</p>
      </div>
    );
  } else if (myInfo)
    return (
      <header>
        <h1 className="text-[30px] font-bold mb-2 dark:text-gray-300">Tokens</h1>
        <p className="text-[20px] mb-2 dark:text-gray-300">Your Authority : {myInfo.role}</p>
      </header>
    );
  else {
    return (
      <div>
        <p>Unexpected error occurred</p>
      </div>
    );
  }
};

export default TokenHeader;
