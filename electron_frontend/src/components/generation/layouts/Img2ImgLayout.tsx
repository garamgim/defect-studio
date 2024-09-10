import Sidebar from '../sidebar/Img2ImgSidebar';
import Prompt from '../params/PromptParams';

const ImageToImage = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[340px] px-8 h-full">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-end px-8 w-full">
        <div className="border border-red h-full mb-8"></div>
        <div className="mt-auto w-full">
          <Prompt />
        </div>
      </div>
    </div>
  );
};

export default ImageToImage;
