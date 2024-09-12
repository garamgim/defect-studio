import Sidebar from '../sidebar/Img2ImgSidebar';
import PromptParams from '../params/PromptParams';
import Img2ImgDisplay from '../outputDisplay/Img2ImgDisplay';
import { RootState } from '../../../store/store';
import { setPrompt, setNegativePrompt, setIsNegativePrompt } from '../../../store/slices/generation/img2ImgSlice';
import { useSelector, useDispatch } from 'react-redux';

const Img2ImgLayout = () => {
  const dispatch = useDispatch();
  const { prompt, negativePrompt, isNegativePrompt } = useSelector((state: RootState) => state.img2Img);

  const handleNegativePromptChange = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  return (
    <div className="flex h-[calc(100vh-60px)] pt-4 pb-6">
      {/* 사이드바 */}
      <div className="w-[360px] pl-8 pr-4 h-full hidden md:block">
        <Sidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col px-8 w-full h-full">
        <div className="flex-1 mb-8 overflow-y-auto custom-scrollbar p-4">
          <Img2ImgDisplay />
        </div>

        <div className="w-full flex-none">
          <PromptParams
            prompt={prompt}
            negativePrompt={negativePrompt}
            setPrompt={(value) => {
              dispatch(setPrompt(value));
            }}
            setNegativePrompt={(value) => {
              dispatch(setNegativePrompt(value));
            }}
            isNegativePrompt={isNegativePrompt}
            handleNegativePromptChange={handleNegativePromptChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Img2ImgLayout;
