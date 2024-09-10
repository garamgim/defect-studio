export interface txtToImgData {
  model: string;
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
