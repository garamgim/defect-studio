import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const useRemoveBgOutputs = () => {
  // 개별적으로 상태 호출 (묶으면 전체 리렌더링되므로)
  const isLoading = useSelector((state: RootState) => state.generatedOutput.removeBg.isLoading);
  const taskId = useSelector((state: RootState) => state.generatedOutput.removeBg.taskId);
  const output = useSelector((state: RootState) => state.generatedOutput.removeBg.output);
  const allOutputs = useSelector((state: RootState) => state.generatedOutput.removeBg.allOutputs);
  const isSidebarVisible = useSelector((state: RootState) => state.generatedOutput.removeBg.isSidebarVisible);

  return {
    isLoading,
    taskId,
    output,
    allOutputs,
    isSidebarVisible
  };
};
