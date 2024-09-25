import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useCallback } from 'react';
import {
  setModelParams,
  setSamplingParams,
  setGuidanceParams,
  setImgDimensionParams,
  setBatchParams,
  setPrompt,
  setIsNegativePrompt,
  setNegativePrompt,
  setSeedParams
} from '../../store/slices/generation/txt2ImgSlice';

export const useTxt2ImgParams = () => {
  const dispatch = useDispatch();
  const modelParams = useSelector((state: RootState) => state.txt2Img.params.modelParams);
  const samplingParams = useSelector((state: RootState) => state.txt2Img.params.samplingParams);
  const guidanceParams = useSelector((state: RootState) => state.txt2Img.params.guidanceParams);
  const imgDimensionParams = useSelector((state: RootState) => state.txt2Img.params.imgDimensionParams);
  const seedParams = useSelector((state: RootState) => state.txt2Img.params.seedParams);
  const batchParams = useSelector((state: RootState) => state.txt2Img.params.batchParams);

  // prompt는 자주변경되기 때문에 따로 개별 구독
  const prompt = useSelector((state: RootState) => state.txt2Img.params.promptParams.prompt);
  const isNegativePrompt = useSelector((state: RootState) => state.txt2Img.params.promptParams.isNegativePrompt);
  const negativePrompt = useSelector((state: RootState) => state.txt2Img.params.promptParams.negativePrompt);

  // params 업데이트 함수들
  const updateModelParams = useCallback((model: string) => {
    dispatch(setModelParams(model));
  }, []);
  const updateSamplingParams = useCallback((scheduler: string, numInferenceSteps: number) => {
    dispatch(setSamplingParams({ scheduler, numInferenceSteps }));
  }, []);
  const updateGuidanceParams = useCallback((guidanceScale: number) => {
    dispatch(setGuidanceParams(guidanceScale));
  }, []);
  const updateImgDimensionParams = useCallback((width: number, height: number) => {
    dispatch(setImgDimensionParams({ width, height }));
  }, []);
  const updateSeedParams = useCallback((seed: number, isRandomSeed: boolean) => {
    dispatch(setSeedParams({ seed, isRandomSeed }));
  }, []);
  const updateBatchParams = useCallback((batchCount: number, batchSize: number) => {
    dispatch(setBatchParams({ batchCount, batchSize }));
  }, []);

  const updatePrompt = useCallback((prompt: string) => {
    dispatch(setPrompt(prompt));
  }, []);
  const updateIsNegativePrompt = useCallback((isNegativePrompt: boolean) => {
    dispatch(setIsNegativePrompt(isNegativePrompt));
  }, []);
  const updateNegativePrompt = useCallback((negativePRompt: string) => {
    dispatch(setNegativePrompt(negativePRompt));
  }, []);

  return {
    modelParams,
    samplingParams,
    guidanceParams,
    imgDimensionParams,
    seedParams,
    batchParams,
    prompt,
    isNegativePrompt,
    negativePrompt,
    updateModelParams,
    updateSamplingParams,
    updateSeedParams,
    updateGuidanceParams,
    updateImgDimensionParams,
    updateBatchParams,
    updatePrompt,
    updateIsNegativePrompt,
    updateNegativePrompt
  };
};
