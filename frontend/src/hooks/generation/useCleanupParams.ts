import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setInitImageList,
  setMaskImageList,
  setOutputImgUrls,
  setIsLoading,
  setInitInputPath,
  setMaskInputPath,
  setOutputPath,
  setMode,
  setCombinedImg
} from '../../store/slices/generation/cleanupSlice';
import { useCallback } from 'react';

export const useCleanupParams = () => {
  const dispatch = useDispatch();

  // 상태값들 가져오기 (성능 최적화를 위해 따로따로 불러옴- 리렌더링 방지)
  const initImageList = useSelector((state: RootState) => state.cleanup.initImageList);
  const maskImageList = useSelector((state: RootState) => state.cleanup.maskImageList);
  const outputImgUrls = useSelector((state: RootState) => state.cleanup.outputImgUrls);
  const initInputPath = useSelector((state: RootState) => state.cleanup.initInputPath);
  const maskInputPath = useSelector((state: RootState) => state.cleanup.maskInputPath);
  const outputPath = useSelector((state: RootState) => state.cleanup.outputPath);
  const isLoading = useSelector((state: RootState) => state.cleanup.isLoading);
  const mode = useSelector((state: RootState) => state.cleanup.mode);
  const combinedImg = useSelector((state: RootState) => state.cleanup.combinedImg);

  // 상태 업데이트 함수
  const handleSetInitImageList = useCallback(
    (value: string[]) => {
      dispatch(setInitImageList(value));
    },
    [dispatch]
  );

  const handleSetMaskImageList = useCallback(
    (value: string[]) => {
      dispatch(setMaskImageList(value));
    },
    [dispatch]
  );

  const handleSetOutputImgUrls = useCallback(
    (value: string[]) => {
      dispatch(setOutputImgUrls(value));
    },
    [dispatch]
  );

  const handleSetInitInputPath = useCallback(
    (value: string) => {
      dispatch(setInitInputPath(value));
    },
    [dispatch]
  );

  const handleSetMaskInputPath = useCallback(
    (value: string) => {
      dispatch(setMaskInputPath(value));
    },
    [dispatch]
  );

  const handleSetOutputPath = useCallback(
    (value: string) => {
      dispatch(setOutputPath(value));
    },
    [dispatch]
  );

  const handleSetIsLoading = useCallback(
    (value: boolean) => {
      dispatch(setIsLoading(value));
    },
    [dispatch]
  );

  const handleSetMode = useCallback(
    (value: 'manual' | 'batch') => {
      dispatch(setMode(value));
    },
    [dispatch]
  );

  const handleSetCombinedImg = useCallback(
    (value: string) => {
      dispatch(setCombinedImg(value));
    },
    [dispatch]
  );

  return {
    initImageList,
    maskImageList,
    outputImgUrls,
    initInputPath,
    maskInputPath,
    outputPath,
    isLoading,
    mode,
    combinedImg,
    handleSetInitImageList,
    handleSetMaskImageList,
    handleSetOutputImgUrls,
    handleSetInitInputPath,
    handleSetMaskInputPath,
    handleSetOutputPath,
    handleSetIsLoading,
    handleSetMode,
    handleSetCombinedImg
  };
};
