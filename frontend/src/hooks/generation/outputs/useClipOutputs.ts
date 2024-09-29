import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export const useClipOutputs = () => {
  const isLoading = useSelector((state: RootState) => state.generatedOutput.clip.isLoading);
  const taskId = useSelector((state: RootState) => state.generatedOutput.clip.taskId);
  0;
  return {
    isLoading,
    taskId
  };
};
