export interface ModelParamsType {
  isInpaint?: boolean;
  findHuggingFace?: boolean;
  pretrainedModelNameOrPath: string;
  trainModelName: string;
  tokenizerName?: string;
  revision?: string;
}

export interface ConceptListParamsType {
  instanceImageList: string;
  instancePrompt: string;
  classImageList: string;
  classPrompt: string;
}

export interface ImgsParamsType {
  resolution: number;
  priorLossWeight?: number;
  centerCrop?: boolean;
}

export interface TrainingParamsType {
  trainBatchSize: number;
  numTrainEpochs: number;
  learningRate: number;
  maxTrainSteps?: number | null;
  gradientAccumulationSteps?: number | null;
  scaleLr?: boolean;
  lrScheduler?:
    | null
    | 'linear'
    | 'cosine'
    | 'cosine_with_restarts'
    | 'polynomial'
    | 'constant'
    | 'constant_with_warmup';
  lrWarmupSteps?: number | null;
  lrNumCycles?: number | null;
  lrPower?: number | null;
  use8bitAdam?: boolean;
  gradientCheckpointing?: boolean;
  seed?: number | null;
  trainTextEncoder?: boolean;
}

export interface OptimizerParamsType {
  adamBeta1?: number | null;
  adamBeta2?: number | null;
  adamWeightDecay?: number | null;
  adamEpsilon?: number | null;
  maxGradNorm?: number | null;
}

export interface CheckpointParamsType {
  checkpointingSteps?: number | null;
  checkpointsTotalLimit?: number | null;
  resumeFromCheckpoint?: string;
}

export interface TrainingDataType {
  gpu_env: 'local' | 'remote';
  data: TrainingParams;
}

interface ConceptListParams {
  instance_prompt: string;
  class_prompt: string;
  class_image_count: number;
  instance_image_count: number;
}

export interface TrainingParams {
  gpu_device: number;
  is_inpaint?: boolean;
  find_hugging_face?: boolean;
  pretrained_model_name_or_path: string;
  train_model_name: string;
  tokenizer_name?: string;
  revision?: string;
  instance_image_list: File[];
  class_image_list: File[];
  concept_list: ConceptListParams[];
  resolution: number;
  prior_loss_weight?: number;
  center_crop?: boolean;
  train_batch_size: number;
  num_train_epochs: number;
  learning_rate: number;
  max_train_steps?: number | null;
  gradient_accumulation_steps?: number;
  scale_lr?: boolean;
  lr_scheduler?:
    | null
    | 'linear'
    | 'cosine'
    | 'cosine_with_restarts'
    | 'polynomial'
    | 'constant'
    | 'constant_with_warmup';
  lr_warmup_steps?: number | null;
  lr_num_cycles?: number | null;
  lr_power?: number | null;
  use_8bit_adam?: boolean;
  gradient_checkpointing?: boolean;
  seed?: number | null;
  train_text_encoder?: boolean;
  adam_beta1?: number | null;
  adam_beta2?: number | null;
  adam_weight_decay?: number | null;
  adam_epsilon?: number | null;
  max_grad_norm?: number | null;
  checkpointing_steps?: number | null;
  checkpoints_total_limit?: number | null;
  resume_from_checkpoint?: string;
}
