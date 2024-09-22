import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setWidth,
  setHeight,
  setBatchCount,
  setGuidanceScale,
  setNumInferenceSteps,
  setSeed,
  setIsRandomSeed,
  setModel,
  setScheduler,
  setPrompt,
  setNegativePrompt,
  setBatchSize,
  setIsNegativePrompt,
  setOutputImgUrls,
  setIsLoading,
  setInitImageList,
  setMaskImageList,
  setClipData,
  setInitInputPath,
  setMaskInputPath,
  setOutputPath,
  setMode,
  setStrength,
  setCombinedImg
} from '../../store/slices/generation/inpaintingSlice';
import { useCallback } from 'react';

export const useInpaintingParams = () => {
  const dispatch = useDispatch();

  // 상태값들 가져오기 (성능 최적화를 위해 따로따로 불러옴- 리렌더링 방지)
  const width = useSelector((state: RootState) => state.inpainting.width);
  const height = useSelector((state: RootState) => state.inpainting.height);
  const guidanceScale = useSelector((state: RootState) => state.inpainting.guidanceScale);
  const numInferenceSteps = useSelector((state: RootState) => state.inpainting.numInferenceSteps);
  const seed = useSelector((state: RootState) => state.inpainting.seed);
  const isRandomSeed = useSelector((state: RootState) => state.inpainting.isRandomSeed);
  const model = useSelector((state: RootState) => state.inpainting.model);
  const scheduler = useSelector((state: RootState) => state.inpainting.scheduler);
  const batchCount = useSelector((state: RootState) => state.inpainting.batchCount);
  const batchSize = useSelector((state: RootState) => state.inpainting.batchSize);
  const prompt = useSelector((state: RootState) => state.inpainting.prompt);
  const negativePrompt = useSelector((state: RootState) => state.inpainting.negativePrompt);
  const strength = useSelector((state: RootState) => state.inpainting.strength);
  const initInputPath = useSelector((state: RootState) => state.inpainting.initInputPath);
  const maskInputPath = useSelector((state: RootState) => state.inpainting.maskInputPath);
  const mode = useSelector((state: RootState) => state.inpainting.mode);
  const combinedImg = useSelector((state: RootState) => state.inpainting.combinedImg);
  const clipData = useSelector((state: RootState) => state.inpainting.clipData);

  const isNegativePrompt = useSelector((state: RootState) => state.inpainting.isNegativePrompt);
  const outputPath = useSelector((state: RootState) => state.inpainting.outputPath);
  const isLoading = useSelector((state: RootState) => state.inpainting.isLoading);
  const outputImgUrls = useSelector((state: RootState) => state.inpainting.outputImgUrls);
  const initImageList = useSelector((state: RootState) => state.inpainting.initImageList);
  const maskImageList = useSelector((state: RootState) => state.inpainting.maskImageList);

  // 상태 업데이트 함수
  const handleSetWidth = useCallback(
    (value: number) => {
      dispatch(setWidth(value));
    },
    [dispatch]
  );

  const handleSetHeight = useCallback(
    (value: number) => {
      dispatch(setHeight(value));
    },
    [dispatch]
  );

  const handleSetBatchCount = useCallback(
    (value: number) => {
      dispatch(setBatchCount(value));
    },
    [dispatch]
  );

  const handleSetGuidanceScale = useCallback(
    (value: number) => {
      dispatch(setGuidanceScale(value));
    },
    [dispatch]
  );

  const handleSetNumInferenceSteps = useCallback(
    (value: number) => {
      dispatch(setNumInferenceSteps(value));
    },
    [dispatch]
  );

  const handleSetSeed = useCallback(
    (value: number) => {
      dispatch(setSeed(value));
    },
    [dispatch]
  );

  const handleSetIsRandomSeed = useCallback(
    (value: boolean) => {
      dispatch(setIsRandomSeed(value));
    },
    [dispatch]
  );

  const handleSetModel = useCallback(
    (value: string) => {
      dispatch(setModel(value));
    },
    [dispatch]
  );

  const handleSetScheduler = useCallback(
    (value: string) => {
      dispatch(setScheduler(value));
    },
    [dispatch]
  );

  const handleSetPrompt = useCallback(
    (value: string) => {
      dispatch(setPrompt(value));
    },
    [dispatch]
  );

  const handleSetNegativePrompt = useCallback(
    (value: string) => {
      dispatch(setNegativePrompt(value));
    },
    [dispatch]
  );

  const handleSetIsNegativePrompt = useCallback(
    (value: boolean) => {
      dispatch(setIsNegativePrompt(value));
    },
    [dispatch]
  );

  const handleSetOutputImgUrls = useCallback(
    (value: string[]) => {
      dispatch(setOutputImgUrls(value));
    },
    [dispatch]
  );

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

  const handleSetBatchSize = useCallback(
    (value: number) => {
      dispatch(setBatchSize(value));
    },
    [dispatch]
  );

  const handleSetIsLoading = useCallback(
    (value: boolean) => {
      dispatch(setIsLoading(value));
    },
    [dispatch]
  );

  const handleSetClipData = useCallback(
    (value: string[]) => {
      dispatch(setClipData(value));
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

  const handleSetMode = useCallback(
    (value: 'manual' | 'batch') => {
      dispatch(setMode(value));
    },
    [dispatch]
  );

  const handleSetStrength = useCallback(
    (value: number) => {
      dispatch(setStrength(value));
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
    width,
    height,
    guidanceScale,
    numInferenceSteps,
    seed,
    isRandomSeed,
    model,
    scheduler,
    batchCount,
    batchSize,
    prompt,
    negativePrompt,
    isNegativePrompt,
    outputPath,
    isLoading,
    outputImgUrls,
    initImageList,
    maskImageList,
    strength,
    maskInputPath,
    mode,
    clipData,
    initInputPath,
    combinedImg,
    handleSetWidth,
    handleSetHeight,
    handleSetGuidanceScale,
    handleSetNumInferenceSteps,
    handleSetSeed,
    handleSetIsRandomSeed,
    handleSetModel,
    handleSetScheduler,
    handleSetPrompt,
    handleSetNegativePrompt,
    handleSetBatchCount,
    handleSetBatchSize,
    handleSetIsNegativePrompt,
    handleSetOutputImgUrls,
    handleSetInitImageList,
    handleSetMaskImageList,
    handleSetIsLoading,
    handleSetClipData,
    handleSetInitInputPath,
    handleSetMaskInputPath,
    handleSetOutputPath,
    handleSetMode,
    handleSetStrength,
    handleSetCombinedImg
  };
};
