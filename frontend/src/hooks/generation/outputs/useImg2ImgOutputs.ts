import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const useImg2ImgOutputs = () => {
  // 개별적으로 상태 호출 (묶으면 전체 리렌더링되므로)
  const isLoading = useSelector((state: RootState) => state.generatedOutput.img2Img.isLoading);
  const taskId = useSelector((state: RootState) => state.generatedOutput.img2Img.taskId);
  const output = useSelector((state: RootState) => state.generatedOutput.img2Img.output);
  const allOutputs = useSelector((state: RootState) => state.generatedOutput.img2Img.allOutputs);
  const isSidebarVisible = useSelector((state: RootState) => state.generatedOutput.img2Img.isSidebarVisible);

  return {
    isLoading,
    taskId,
    output,
    allOutputs,
    isSidebarVisible
  };
};
