export interface Txt2ImgDataType {
  gpu_env: 'local' | 'remote';
  data: {
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
  };
}

export interface Img2ImgDataType {
  gpu_env: string;
  data: {
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
    images: File[];
    input_path: string;
    output_path: string;
  };
}

export interface InpaintingDataType {
  gpu_env: string;
  data: {
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
  };
}

export interface RemoveBgDataType {
  gpu_env: string;
  data: {
    images: File[];
    input_path: string;
    output_path: string;
  };
}

export interface CleanupDataType {
  gpu_env: string;
  data: {
    images: File[];
    masks: File[];
  };
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
  _member_id?: number; // 필요없는 정보
  date?: string; // 필요없는 정보
}
