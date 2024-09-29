export interface FolderListDataType {
  id: string;
  generation_type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'cleanup';
  date: string;
  prompt: string | null;
  num_of_generated_images: number;
  first_image_url: string;
}

export interface FolderDetailDataType {
  _id: string;
  generation_type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'cleanup';
  model: string;
  prompt: string | null;
  negative_prompt: string | null;
  width: number | null;
  height: number | null;
  batch_count: number | null;
  batch_size: number;
  strength: number | null;
  guidance_scale: number | null;
  sampling_steps: number | null;
  scheduler: string | null;
  seed: number | null;
  member_id: number;
  date: string;
  num_of_generated_images: number;
  image_url_list: string[];
}
