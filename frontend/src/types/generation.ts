// 상태 관리
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
  mode: string;
  inputPath: string;
  outputPath: string;
}
export interface uploadImgWithMaskingParamsType extends UploadImgParamsType {
  maskInputPath: string;
}

// API 통신
export interface Txt2ImgDataType {
  gpu_env: 'local' | 'remote';
  data: Txt2ImgParams;
}

export interface Txt2ImgParams {
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
  image_list: File[];
  input_path: string;
  output_path: string;
}

export interface CleanupDataType {
  gpu_env: 'local' | 'remote';
  data: CleanupParams;
}

export interface CleanupParams {
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

  _id?: string; // 필요없는 정보
  member_id?: number; // 필요없는 정보
  date?: string; // 필요없는 정보
}
