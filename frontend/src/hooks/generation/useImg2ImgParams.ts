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
  setImageList,
  setStrength,
  setInputPath,
  setOutputPath,
  setMode,
  setClipData
} from '../../store/slices/generation/img2ImgSlice';
import { useCallback } from 'react';

export const useImg2ImgParams = () => {
  const dispatch = useDispatch();

  // 상태값들 가져오기 (성능 최적화를 위해 따로따로 불러옴- 리렌더링 방지)
  const width = useSelector((state: RootState) => state.img2Img.width);
  const height = useSelector((state: RootState) => state.img2Img.height);
  const guidanceScale = useSelector((state: RootState) => state.img2Img.guidanceScale);
  const numInferenceSteps = useSelector((state: RootState) => state.img2Img.numInferenceSteps);
  const seed = useSelector((state: RootState) => state.img2Img.seed);
  const isRandomSeed = useSelector((state: RootState) => state.img2Img.isRandomSeed);
  const model = useSelector((state: RootState) => state.img2Img.model);
  const scheduler = useSelector((state: RootState) => state.img2Img.scheduler);
  const batchCount = useSelector((state: RootState) => state.img2Img.batchCount);
  const batchSize = useSelector((state: RootState) => state.img2Img.batchSize);
  const prompt = useSelector((state: RootState) => state.img2Img.prompt);
  const negativePrompt = useSelector((state: RootState) => state.img2Img.negativePrompt);
  const isNegativePrompt = useSelector((state: RootState) => state.img2Img.isNegativePrompt);
  const outputPath = useSelector((state: RootState) => state.img2Img.outputPath);
  const isLoading = useSelector((state: RootState) => state.img2Img.isLoading);
  const outputImgUrls = useSelector((state: RootState) => state.img2Img.outputImgUrls);
  const imageList = useSelector((state: RootState) => state.img2Img.imageList);
  const strength = useSelector((state: RootState) => state.img2Img.strength);
  const inputPath = useSelector((state: RootState) => state.img2Img.inputPath);
  const mode = useSelector((state: RootState) => state.img2Img.mode);
  const clipData = useSelector((state: RootState) => state.img2Img.clipData);

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

  const handleSetImageList = useCallback(
    (value: string[]) => {
      dispatch(setImageList(value));
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

  const handleSetClipData = useCallback(
    (value: string[]) => {
      dispatch(setClipData(value));
    },
    [dispatch]
  );

  const handleSetStrength = useCallback(
    (value: number) => {
      dispatch(setStrength(value));
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
    imageList,
    strength,
    inputPath,
    mode,
    clipData,
    handleSetStrength,
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
    handleSetImageList,
    handleSetIsLoading,
    handleSetInputPath,
    handleSetOutputPath,
    handleSetMode,
    handleSetClipData
  };
};
