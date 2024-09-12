import Sidebar from '../sidebar/InpaintingSidebar';
import PromptParams from '../params/PromptParams';
import InpaintingDisplay from '../outputDisplay/InpaintingDisplay';
import { RootState } from '../../../store/store';
import { setPrompt, setNegativePrompt, setIsNegativePrompt } from '../../../store/slices/generation/inpaintingSlice';
import { useSelector, useDispatch } from 'react-redux';

const InpaintingLayout = () => {
  const { prompt, negativePrompt, isNegativePrompt } = useSelector((state: RootState) => state.inpainting);
  const dispatch = useDispatch();

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
          {/* ImageDisplay가 남은 높이를 차지하도록 flex-1 적용 */}
          <InpaintingDisplay />
        </div>
        <div className="w-full flex-none">
          {/* Prompt는 고정된 높이를 가짐 */}
          <PromptParams
            prompt={prompt}
            negativePrompt={negativePrompt}
            isNegativePrompt={isNegativePrompt}
            setPrompt={(value) => dispatch(setPrompt(value))}
            setNegativePrompt={(value) => {
              dispatch(setNegativePrompt(value));
            }}
            handleNegativePromptChange={handleNegativePromptChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InpaintingLayout;
