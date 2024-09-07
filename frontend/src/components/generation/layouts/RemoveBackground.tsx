import Sidebar from '../sidebar/RemoveBgSidebar';

const RemoveBackground = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] bg-gray-100">
      <div className="w-[340px] p-8 h-full">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-end p-8 w-full">

      </div>
    </div>
  );
};

export default RemoveBackground;