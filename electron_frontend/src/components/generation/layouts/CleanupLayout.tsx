import Sidebar from '../sidebar/CleanupSidebar';

const Cleanup = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[360px] pl-8 pr-4 h-full hidden md:block">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-end px-8 w-full">
        <div className="h-full"></div>
      </div>
    </div>
  );
};

export default Cleanup;
