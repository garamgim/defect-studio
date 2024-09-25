import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setInitImageList,
  setMaskImageList,
  setInitInputPath,
  setMaskInputPath,
  setOutputPath,
  setMode,
  setCombinedImg
} from '../../store/slices/generation/cleanupSlice';
import { useCallback } from 'react';

export const useCleanupParams = () => {
  const dispatch = useDispatch();

  // uploadImgParams도 자주 변경될 수 있으므로 따로 개별 호출
  const mode = useSelector((state: RootState) => state.cleanup.params.uploadImgWithMaskingParams.mode);
  const combinedImg = useSelector((state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.combinedImg);
  const initImageList = useSelector(
    (state: RootState) => state.cleanup.params.uploadImgWithMaskingParams.initImageList
  );
  const maskImageList = useSelector(
    (state: RootState) => state.cleanup.params.uploadImgWithMaskingParams.maskImageList
  );
  const maskInputPath = useSelector(
    (state: RootState) => state.cleanup.params.uploadImgWithMaskingParams.maskInputPath
  );
  const initInputPath = useSelector(
    (state: RootState) => state.cleanup.params.uploadImgWithMaskingParams.initInputPath
  );
  const outputPath = useSelector((state: RootState) => state.cleanup.params.uploadImgWithMaskingParams.outputPath);

  const updateMode = useCallback(
    (mode: 'manual' | 'batch') => {
      dispatch(setMode(mode));
    },
    [dispatch]
  );
  const updateInitImageList = useCallback(
    (initImageList: string[]) => {
      dispatch(setInitImageList(initImageList));
    },
    [dispatch]
  );
  const updateMaskImageList = useCallback(
    (maskImageList: string[]) => {
      dispatch(setMaskImageList(maskImageList));
    },
    [dispatch]
  );
  const updateMaskInputPath = useCallback(
    (maskInputPath: string) => {
      dispatch(setMaskInputPath(maskInputPath));
    },
    [dispatch]
  );
  const updateCombinedImg = useCallback(
    (combinedImg: string) => {
      dispatch(setCombinedImg(combinedImg));
    },
    [dispatch]
  );
  const updateInitInputPath = useCallback(
    (initInputPath: string) => {
      dispatch(setInitInputPath(initInputPath));
    },
    [dispatch]
  );
  const updateOutputPath = useCallback(
    (outputPath: string) => {
      dispatch(setOutputPath(outputPath));
    },
    [dispatch]
  );

  return {
    mode,
    combinedImg,
    initImageList,
    maskImageList,
    maskInputPath,
    initInputPath,
    outputPath,
    updateMode,
    updateInitImageList,
    updateMaskImageList,
    updateCombinedImg,
    updateMaskInputPath,
    updateInitInputPath,
    updateOutputPath
  };
};
