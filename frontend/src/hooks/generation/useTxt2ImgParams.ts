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
  // 리렌더링 고려 (컴포넌트별 호출)
  const modelParams = useSelector((state: RootState) => state.txt2Img.params.modelParams);
  const samplingParams = useSelector((state: RootState) => state.txt2Img.params.samplingParams);
  const guidanceParams = useSelector((state: RootState) => state.txt2Img.params.guidanceParams);
  const imgDimensionParams = useSelector((state: RootState) => state.txt2Img.params.imgDimensionParams);
  const seedParams = useSelector((state: RootState) => state.txt2Img.params.seedParams);
  const batchParams = useSelector((state: RootState) => state.txt2Img.params.batchParams);

  // prompt는 자주 변경되기 때문에 따로 개별 호출
  const prompt = useSelector((state: RootState) => state.txt2Img.params.promptParams.prompt);
  const isNegativePrompt = useSelector((state: RootState) => state.txt2Img.params.promptParams.isNegativePrompt);
  const negativePrompt = useSelector((state: RootState) => state.txt2Img.params.promptParams.negativePrompt);

  // params 업데이트 함수들
  const updateModelParams = useCallback(
    (model: string) => {
      dispatch(setModelParams(model));
    },
    [dispatch]
  );
  const updateSamplingParams = useCallback(
    (scheduler: string, numInferenceSteps: number) => {
      dispatch(setSamplingParams({ scheduler, numInferenceSteps }));
    },
    [dispatch]
  );
  const updateGuidanceParams = useCallback(
    (guidanceScale: number) => {
      dispatch(setGuidanceParams(guidanceScale));
    },
    [dispatch]
  );
  const updateImgDimensionParams = useCallback(
    (width: number, height: number) => {
      dispatch(setImgDimensionParams({ width, height }));
    },
    [dispatch]
  );
  const updateSeedParams = useCallback(
    (seed: number, isRandomSeed: boolean) => {
      dispatch(setSeedParams({ seed, isRandomSeed }));
    },
    [dispatch]
  );
  const updateBatchParams = useCallback(
    (batchCount: number, batchSize: number) => {
      dispatch(setBatchParams({ batchCount, batchSize }));
    },
    [dispatch]
  );

  const updatePrompt = useCallback(
    (prompt: string) => {
      dispatch(setPrompt(prompt));
    },
    [dispatch]
  );
  const updateIsNegativePrompt = useCallback(
    (isNegativePrompt: boolean) => {
      dispatch(setIsNegativePrompt(isNegativePrompt));
    },
    [dispatch]
  );
  const updateNegativePrompt = useCallback(
    (negativePRompt: string) => {
      dispatch(setNegativePrompt(negativePRompt));
    },
    [dispatch]
  );

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
