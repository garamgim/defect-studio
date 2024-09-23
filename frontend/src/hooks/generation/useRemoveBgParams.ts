import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setImageList,
  setOutputImgUrls,
  setIsLoading,
  setInputPath,
  setOutputPath,
  setMode
} from '../../store/slices/generation/removeBgSlice';
import { useCallback } from 'react';

export const useRemoveBgParams = () => {
  const dispatch = useDispatch();

  // 상태값들 가져오기 (성능 최적화를 위해 따로따로 불러옴- 리렌더링 방지)
  const imageList = useSelector((state: RootState) => state.removeBg.imageList);
  const outputImgUrls = useSelector((state: RootState) => state.removeBg.outputImgUrls);
  const inputPath = useSelector((state: RootState) => state.removeBg.inputPath);
  const outputPath = useSelector((state: RootState) => state.removeBg.outputPath);
  const isLoading = useSelector((state: RootState) => state.removeBg.isLoading);
  const mode = useSelector((state: RootState) => state.removeBg.mode);

  // 상태 업데이트 함수
  const handleSetImageList = useCallback(
    (value: string[]) => {
      dispatch(setImageList(value));
    },
    [dispatch]
  );

  const handleSetOutputImgUrls = useCallback(
    (value: string[]) => {
      dispatch(setOutputImgUrls(value));
    },
    [dispatch]
  );

  const handleSetIsLoading = useCallback(
    (value: boolean) => {
      dispatch(setIsLoading(value));
    },
    [dispatch]
  );

  const handleSetInputPath = useCallback(
    (value: string) => {
      dispatch(setInputPath(value));
    },
    [dispatch]
  );

  const handleSetOutputPath = useCallback(
    (value: string) => {
      dispatch(setOutputPath(value));
    },
    [dispatch]
  );

  const handleSetMode = useCallback(
    (value: 'manual' | 'batch') => {
      dispatch(setMode(value));
    },
    [dispatch]
  );

  return {
    imageList,
    outputImgUrls,
    inputPath,
    outputPath,
    isLoading,
    mode,
    handleSetImageList,
    handleSetOutputImgUrls,
    handleSetIsLoading,
    handleSetInputPath,
    handleSetOutputPath,
    handleSetMode
  };
};
