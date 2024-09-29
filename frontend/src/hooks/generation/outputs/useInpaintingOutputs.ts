import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const useInpaintingOutputs = () => {
  // 개별적으로 상태 호출 (묶으면 전체 리렌더링되므로)
  const isLoading = useSelector((state: RootState) => state.generatedOutput.inpainting.isLoading);
  const taskId = useSelector((state: RootState) => state.generatedOutput.inpainting.taskId);
  const output = useSelector((state: RootState) => state.generatedOutput.inpainting.output);
  const allOutputs = useSelector((state: RootState) => state.generatedOutput.inpainting.allOutputs);
  const selectedImgs = useSelector((state: RootState) => state.generatedOutput.inpainting.selectedImgs);
  const isSidebarVisible = useSelector((state: RootState) => state.generatedOutput.inpainting.isSidebarVisible);
  const isCheckedOutput = useSelector((state: RootState) => state.generatedOutput.inpainting.isCheckedOutput);

  return {
    isLoading,
    taskId,
    output,
    selectedImgs,
    allOutputs,
    isSidebarVisible,
    isCheckedOutput
  };
};
