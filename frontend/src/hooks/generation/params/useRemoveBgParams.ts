import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setImageList,
  setInputPath,
  setIsZipDownload,
  setOutputPath,
  setMode
} from '../../../store/slices/generation/removeBgSlice';
import { useCallback } from 'react';

export const useRemoveBgParams = () => {
  const dispatch = useDispatch();

  // uploadImgParams도 자주 변경될 수 있으므로 따로 개별 호출
  const mode = useSelector((state: RootState) => state.removeBg.params.uploadImgParams.mode);
  const imageList = useSelector((state: RootState) => state.removeBg.params.uploadImgParams.imageList);
  const inputPath = useSelector((state: RootState) => state.removeBg.params.uploadImgParams.inputPath);
  const outputPath = useSelector((state: RootState) => state.removeBg.params.uploadImgParams.outputPath);
  const isZipDownload = useSelector((state: RootState) => state.removeBg.params.uploadImgParams.isZipDownload);

  const updateMode = useCallback(
    (mode: 'manual' | 'batch') => {
      dispatch(setMode(mode));
    },
    [dispatch]
  );
  const updateImageList = useCallback(
    (imageList: string[]) => {
      dispatch(setImageList(imageList));
    },
    [dispatch]
  );
  const updateInputPath = useCallback(
    (inputPath: string) => {
      dispatch(setInputPath(inputPath));
    },
    [dispatch]
  );
  const updateOutputPath = useCallback(
    (outputPath: string) => {
      dispatch(setOutputPath(outputPath));
    },
    [dispatch]
  );
  const updateIsZipDownload = useCallback(
    (isZipDownload: boolean) => {
      dispatch(setIsZipDownload(isZipDownload));
    },
    [dispatch]
  );

  return {
    imageList,
    inputPath,
    outputPath,
    mode,
    isZipDownload,
    updateIsZipDownload,
    updateMode,
    updateImageList,
    updateInputPath,
    updateOutputPath
  };
};
