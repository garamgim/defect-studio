import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  setModelParams,
  setSamplingParams,
  setGuidanceParams,
  setImgDimensionParams,
  setBatchParams,
  setPrompt,
  setIsNegativePrompt,
  setNegativePrompt,
  setSeedParams,
  setStrengthParams,
  setMode,
  setClipData,
  setInitImageList,
  setMaskImageList,
  setMaskInputPath,
  setInitInputPath,
  setOutputPath,
  setCombinedImg
} from '../../store/slices/generation/inpaintingSlice';
import { useCallback } from 'react';

export const useInpaintingParams = () => {
  const dispatch = useDispatch();
  // 리렌더링 고려 (컴포넌트별 호출)
  const modelParams = useSelector((state: RootState) => state.inpainting.params.modelParams);
  const strengthParams = useSelector((state: RootState) => state.inpainting.params.strengthParams);
  const samplingParams = useSelector((state: RootState) => state.inpainting.params.samplingParams);
  const guidanceParams = useSelector((state: RootState) => state.inpainting.params.guidanceParams);
  const imgDimensionParams = useSelector((state: RootState) => state.inpainting.params.imgDimensionParams);
  const seedParams = useSelector((state: RootState) => state.inpainting.params.seedParams);
  const batchParams = useSelector((state: RootState) => state.inpainting.params.batchParams);

  // prompt는 자주 변경되기 때문에 따로 개별 호출
  const prompt = useSelector((state: RootState) => state.inpainting.params.promptParams.prompt);
  const isNegativePrompt = useSelector((state: RootState) => state.inpainting.params.promptParams.isNegativePrompt);
  const negativePrompt = useSelector((state: RootState) => state.inpainting.params.promptParams.negativePrompt);

  // UploadImgWithMaskingParams도 자주 변경될 수 있으므로 따로 개별 호출
  const mode = useSelector((state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.mode);
  const clipData = useSelector((state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.clipData);
  const combinedImg = useSelector((state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.combinedImg);
  const initImageList = useSelector(
    (state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.initImageList
  );
  const maskImageList = useSelector(
    (state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.maskImageList
  );
  const maskInputPath = useSelector(
    (state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.maskInputPath
  );
  const initInputPath = useSelector(
    (state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.initInputPath
  );
  const outputPath = useSelector((state: RootState) => state.inpainting.params.uploadImgWithMaskingParams.outputPath);

  // params 업데이트 함수들
  const updateModelParams = useCallback(
    (model: string) => {
      dispatch(setModelParams(model));
    },
    [dispatch]
  );
  const updateStrengthParams = useCallback(
    (strength: number) => {
      dispatch(setStrengthParams(strength));
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

  const updateMode = useCallback(
    (mode: 'manual' | 'batch') => {
      dispatch(setMode(mode));
    },
    [dispatch]
  );
  const updateClipData = useCallback(
    (clipData: string[]) => {
      dispatch(setClipData(clipData));
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
    modelParams,
    samplingParams,
    guidanceParams,
    imgDimensionParams,
    seedParams,
    batchParams,
    prompt,
    isNegativePrompt,
    negativePrompt,
    strengthParams,
    mode,
    clipData,
    combinedImg,
    initImageList,
    maskImageList,
    maskInputPath,
    initInputPath,
    outputPath,
    updateModelParams,
    updateSamplingParams,
    updateSeedParams,
    updateGuidanceParams,
    updateImgDimensionParams,
    updateBatchParams,
    updatePrompt,
    updateIsNegativePrompt,
    updateNegativePrompt,
    updateMode,
    updateStrengthParams,
    updateClipData,
    updateInitImageList,
    updateMaskImageList,
    updateCombinedImg,
    updateMaskInputPath,
    updateInitInputPath,
    updateOutputPath
  };
};
