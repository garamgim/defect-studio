import Sidebar from '../sidebar/Txt2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Txt2ImgDisplay from '../outputDisplay/Txt2ImgDisplay';

const Txt2ImgLayout = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[360px] pl-8 pr-4 h-full hidden md:block">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 mb-8 overflow-y-auto custom-scrollbar p-4">
          {/* ImageDisplay가 남은 높이를 차지하도록 flex-1 적용 */}
          <Txt2ImgDisplay />
        </div>
        <div className="w-full flex-none">
          {/* Prompt는 고정된 높이를 가짐 */}
          <PromptParams />
        </div>
      </div>
    </div>
  );
};

export default Txt2ImgLayout;
