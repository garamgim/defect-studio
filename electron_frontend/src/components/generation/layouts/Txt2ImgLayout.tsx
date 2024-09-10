import Sidebar from '../sidebar/Txt2ImgSidebar';
import Prompt from '../params/PromptParams';
import ImageDisplay from '../outputDisplay/Txt2ImgDisplay';

const TextToImage = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[340px] px-8 h-full">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 border mb-8 overflow-y-auto custom-scrollbar">
          {/* ImageDisplay가 남은 높이를 차지하도록 flex-1 적용 */}
          <ImageDisplay />
        </div>
        <div className="w-full flex-none">
          {/* Prompt는 고정된 높이를 가짐 */}
          <Prompt />
        </div>
      </div>
    </div>
  );
};

export default TextToImage;
