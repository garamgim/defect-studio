export interface TrainingDataType {
  gpu_env: 'local' | 'remote';
  data: TrainingParams;
}

export interface TrainingParams {
  member_id: number;
  train_model_name: string;
  model: string;
  revision: string;
  variant: string;
  tokenizer_name: string;
  hub_model_id: string;
  push_to_hub: boolean;
  hub_token: string;

  instance_prompt: string;
  class_prompt: string;
  resolution: number;
  train_batch_size: number;
  num_train_epochs: number;
  learning_rate: number;

  with_prior_preservation: boolean;
  prior_loss_weight: number;
  seed: number;
  center_crop: boolean;
  train_text_encoder: boolean;
  sample_batch_size: number;
  max_train_steps: number;
  checkpointing_steps: number;
  checkpoints_total_limit: number | string;
  resume_from_checkpoint: string;
  gradient_accumulation_steps: number;
  gradient_checkpointing: boolean;
  scale_lr: boolean;
  lr_scheduler: string;
  lr_warmup_steps: number;
  lr_num_cycles: number;
  lr_power: number;
  use_8bit_adam: boolean;
  dataloader_num_workers: number;
  adam_beta1: number;
  adam_beta2: number;
  adam_weight_decay: number;
  adam_epsilon: number;
  max_grad_norm: number;

  logging_dir: string;
  allow_tf32: boolean;
  report_to: string;
  validation_prompt: string;
  num_validation_images: number;
  validation_steps: number;
  mixed_precision: string;
  prior_generation_precision: string;
  local_rank: number;
  enable_xformers_memory_efficient_attention: boolean;
  set_grads_to_none: boolean;
  offset_noise: boolean;
  snr_gamma: number;
  pre_compute_text_embeddings: boolean;
  tokenizer_max_length: number;
  text_encoder_use_attention_mask: boolean;
  skip_save_text_encoder: boolean;
  validation_images: string;
  class_labels_conditioning: string;
  validation_scheduler: string;
  instance_image_list: string[];
  class_image_list: string[];
}
