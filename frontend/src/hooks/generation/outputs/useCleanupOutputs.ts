import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const useCleanupOutputs = () => {
  // 개별적으로 상태 호출 (묶으면 전체 리렌더링되므로)
  const isLoading = useSelector((state: RootState) => state.generatedOutput.cleanup.isLoading);
  const taskId = useSelector((state: RootState) => state.generatedOutput.cleanup.taskId);
  const output = useSelector((state: RootState) => state.generatedOutput.cleanup.output);
  const allOutputs = useSelector((state: RootState) => state.generatedOutput.cleanup.allOutputs);
  const isSidebarVisible = useSelector((state: RootState) => state.generatedOutput.cleanup.isSidebarVisible);
  const isCheckedOutput = useSelector((state: RootState) => state.generatedOutput.cleanup.isCheckedOutput);

  return {
    isLoading,
    taskId,
    output,
    allOutputs,
    isSidebarVisible,
    isCheckedOutput
  };
};
