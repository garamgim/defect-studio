import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
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
  setImageList,
  setInputPath,
  setOutputPath,
  setIsZipDownload
} from '../../../store/slices/generation/img2ImgSlice';
import { useCallback } from 'react';

export const useImg2ImgParams = () => {
  const dispatch = useDispatch();
  // 리렌더링 고려 (컴포넌트별 호출)
  const modelParams = useSelector((state: RootState) => state.img2Img.params.modelParams);
  const strengthParams = useSelector((state: RootState) => state.img2Img.params.strengthParams);
  const samplingParams = useSelector((state: RootState) => state.img2Img.params.samplingParams);
  const guidanceParams = useSelector((state: RootState) => state.img2Img.params.guidanceParams);
  const imgDimensionParams = useSelector((state: RootState) => state.img2Img.params.imgDimensionParams);
  const seedParams = useSelector((state: RootState) => state.img2Img.params.seedParams);
  const batchParams = useSelector((state: RootState) => state.img2Img.params.batchParams);

  // prompt는 자주 변경되기 때문에 따로 개별 호출
  const prompt = useSelector((state: RootState) => state.img2Img.params.promptParams.prompt);
  const isNegativePrompt = useSelector((state: RootState) => state.img2Img.params.promptParams.isNegativePrompt);
  const negativePrompt = useSelector((state: RootState) => state.img2Img.params.promptParams.negativePrompt);

  // uploadImgParams도 자주 변경될 수 있으므로 따로 개별 호출
  const mode = useSelector((state: RootState) => state.img2Img.params.uploadImgParams.mode);
  const clipData = useSelector((state: RootState) => state.img2Img.params.uploadImgParams.clipData);
  const imageList = useSelector((state: RootState) => state.img2Img.params.uploadImgParams.imageList);
  const inputPath = useSelector((state: RootState) => state.img2Img.params.uploadImgParams.inputPath);
  const outputPath = useSelector((state: RootState) => state.img2Img.params.uploadImgParams.outputPath);
  const isZipDownload = useSelector((state: RootState) => state.img2Img.params.uploadImgParams.isZipDownload);

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
    imageList,
    inputPath,
    outputPath,
    isZipDownload,
    updateIsZipDownload,
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
    updateImageList,
    updateInputPath,
    updateOutputPath
  };
};
