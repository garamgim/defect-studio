// 상태 관리 타입
export interface OutputInfo {
  id: string;
  imgsUrl: string[];
  prompt: string;
}
export interface OutputsInfoType {
  outputsCnt: number;
  outputsInfo: OutputInfo[];
}

export interface ModelParamsType {
  model: string;
}
export interface BatchParamsType {
  batchCount: number;
  batchSize: number;
}
export interface ImgDimensionParamsType {
  width: number;
  height: number;
}
export interface GuidanceParamsType {
  guidanceScale: number;
}
export interface PromptParamsType {
  prompt: string;
  isNegativePrompt: boolean;
  negativePrompt: string;
}
export interface SamplingParamsType {
  scheduler: string;
  numInferenceSteps: number;
}
export interface SeedParamsType {
  isRandomSeed: boolean;
  seed: number;
}
export interface StrengthParamsType {
  strength: number;
}
export interface UploadImgParamsType {
  mode: 'manual' | 'batch';
  clipData: string[];
  imageList: string[];
  inputPath: string;
  outputPath: string;
  isZipDownload: boolean;
}
export interface UploadImgWithMaskingParamsType extends Omit<UploadImgParamsType, 'imageList' | 'inputPath'> {
  initInputPath: string;
  initImageList: string[];
  maskImageList: string[];
  maskInputPath: string;
  combinedImg: string | null;
}

// API 통신 타입
export interface Txt2ImgDataType {
  gpu_env: 'local' | 'remote';
  data: Txt2ImgParams;
}

export interface Txt2ImgParams {
  gpu_device: number;
  model: string;
  scheduler: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed: number;
  batch_count: number;
  batch_size: number;
  output_path: string;
}

export interface Img2ImgDataType {
  gpu_env: 'local' | 'remote';
  data: Img2ImgParams;
}

export interface Img2ImgParams {
  gpu_device: number;
  model: string;
  scheduler: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  strength: number;
  seed: number;
  batch_count: number;
  batch_size: number;
  image_list: File[];
  input_path: string;
  output_path: string;
}

export interface InpaintingDataType {
  gpu_env: 'local' | 'remote';
  data: InpaintingParams;
}

export interface InpaintingParams {
  gpu_device: number;
  model: string;
  scheduler: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  strength: number;
  seed: number;
  batch_count: number;
  batch_size: number;
  init_image_list: File[];
  mask_image_list: File[];
  init_input_path: string;
  mask_input_path: string;
  output_path: string;
}

export interface RemoveBgDataType {
  gpu_env: 'local' | 'remote';
  data: RemoveBgParams;
}

export interface RemoveBgParams {
  gpu_device: number;
  image_list: File[];
  input_path: string;
  output_path: string;
}

export interface CleanupDataType {
  gpu_env: 'local' | 'remote';
  data: CleanupParams;
}

export interface CleanupParams {
  gpu_device: number;
  init_image_list: File[];
  mask_image_list: File[];
}

export interface PresetDataType {
  preset_title: string;
  generation_type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'clean_up';
  model?: string;
  prompt?: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  batch_count?: number;
  batch_size?: number;
  strength?: number;
  guidance_scale?: number;
  sampling_steps?: number;
  sampling_method?: string;
  seed?: number;
}

export interface ClipDataType {
  gpu_device: number;
  model?: string;
  image_list: File[];
  mode?: 'fast' | 'classic' | 'negative';
  caption?: string;
  batch_size?: number;
}
