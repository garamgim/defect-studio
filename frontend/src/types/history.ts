export interface FolderDataType {
  id: string;
  generation_type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'cleanup';
  date: string;
  prompt: string | null;
  num_of_generated_images: number;
  first_image_url: string;
}
