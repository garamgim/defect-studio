import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrainingState {
  member_id: number;
  train_model_name: string;
  model: string;
  instance_prompt: string;
  class_prompt: string;
  resolution: number;
  train_batch_size: number;
  num_train_epochs: number;
  learning_rate: number;
  revision: string;
  variant: string;
  tokenizer_name: string;
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
  push_to_hub: boolean;
  hub_token: string;
  hub_model_id: string;
  logging_dir: string;
  allow_tf32: boolean;
  report_to: string;
  validation_prompt: string;
  num_validation_images: number;
  validation_steps: number;
  mixed_precision?: string;
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
  class_labels_conditioning?: string;
  validation_scheduler?: string;
  instance_image_list: string[];
  class_image_list: string[];
}

const initialState: TrainingState = {
  member_id: 0,
  train_model_name: '',
  model: 'stable-diffusion-2', // 드롭다운
  instance_prompt: '', // 범주 중에 특징(선 잘린 케이블)
  class_prompt: '', // 큰 범주(케이블)
  resolution: 512, // 학습할 이미지 크기
  train_batch_size: 8,
  num_train_epochs: 10,
  learning_rate: 0.001, // 0과 1사이 실수

  revision: '', // 모델의 버전 <- 여기서는 사용x
  variant: '', // ?????????(이거 드롭다운 같은데 적는 양식이 정해져 있을 것 같음)
  tokenizer_name: '', // 이거 경로?? 어디
  with_prior_preservation: false,
  prior_loss_weight: 0, // with_prior_preservation: true일 때 작성
  seed: 42, // 해당 시드로 재현성 테스트
  center_crop: false,
  train_text_encoder: false, // ?? text_encoder학습 왜 default false??
  sample_batch_size: 4,
  max_train_steps: 1000,
  checkpointing_steps: 500,
  checkpoints_total_limit: 'None', // default: None 맞는지 확인!
  resume_from_checkpoint: '', //경로 "none, latest, path"
  gradient_accumulation_steps: 1,
  gradient_checkpointing: false,
  scale_lr: true,
  lr_scheduler: 'linear', // 드롭다운 <- ""은 뭔지? ("", "constant", "linear", "cosine", "cosine_with_restarts", "polynomial", "constant_with_warmup")
  lr_warmup_steps: 0,
  lr_num_cycles: 1,
  lr_power: 1.0, // lr_scheduler가 polynomial일때만 넣어야함
  use_8bit_adam: false,
  dataloader_num_workers: 4,
  adam_beta1: 0.9,
  adam_beta2: 0.999,
  adam_weight_decay: 0.01,
  adam_epsilon: 1e-8,
  max_grad_norm: 1.0,
  push_to_hub: false, // 이거 가능한건가?????????
  hub_token: '', //push_to_hub있으면 넣어야함
  hub_model_id: '', //push_to_hub있으면 넣어야함
  logging_dir: '', // 이 디렉토리는??? 지정안하면 어디에 저장? 뭔지모르겠음
  allow_tf32: true,
  report_to: 'none', // 이것도 뭐지
  validation_prompt: '', // 검증을 위한 프롬프트 예시??
  num_validation_images: 5,
  validation_steps: 100,
  mixed_precision: '', // 드롭다운 (fp16, bf16) <- 기본값뭔지 데이터 안보낼때 뭘로 들어가고 있는지
  prior_generation_precision: '', // 드롭다운 (fp16, fp32 또는 bf16) <- 기본값뭔지
  local_rank: -1,
  enable_xformers_memory_efficient_attention: false,
  set_grads_to_none: false,
  offset_noise: false,
  snr_gamma: 5.0,
  pre_compute_text_embeddings: false,
  tokenizer_max_length: 512, // 이거 기본값 맞는지 확인
  text_encoder_use_attention_mask: true,
  skip_save_text_encoder: false,
  validation_images: '', //왜 문자열??????????
  instance_image_list: [],
  class_image_list: []
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setMemberId(state, action: PayloadAction<number>) {
      state.member_id = action.payload;
    },
    setTrainModelName(state, action: PayloadAction<string>) {
      state.train_model_name = action.payload;
    },
    setModel(state, action: PayloadAction<string>) {
      state.model = action.payload;
    },
    setInstancePrompt(state, action: PayloadAction<string>) {
      state.instance_prompt = action.payload;
    },
    setClassPrompt(state, action: PayloadAction<string>) {
      state.class_prompt = action.payload;
    },
    setResolution(state, action: PayloadAction<number>) {
      state.resolution = action.payload;
    },
    setTrainBatchSize(state, action: PayloadAction<number>) {
      state.train_batch_size = action.payload;
    },
    setNumTrainEpochs(state, action: PayloadAction<number>) {
      state.num_train_epochs = action.payload;
    },
    setLearningRate(state, action: PayloadAction<number>) {
      state.learning_rate = action.payload;
    },
    setRevision(state, action: PayloadAction<string>) {
      state.revision = action.payload;
    },
    setVariant(state, action: PayloadAction<string>) {
      state.variant = action.payload;
    },
    setTokenizerName(state, action: PayloadAction<string>) {
      state.tokenizer_name = action.payload;
    },
    setWithPriorPreservation(state, action: PayloadAction<boolean>) {
      state.with_prior_preservation = action.payload;
    },
    setPriorLossWeight(state, action: PayloadAction<number>) {
      state.prior_loss_weight = action.payload;
    },
    setSeed(state, action: PayloadAction<number>) {
      state.seed = action.payload;
    },
    setCenterCrop(state, action: PayloadAction<boolean>) {
      state.center_crop = action.payload;
    },
    setTrainTextEncoder(state, action: PayloadAction<boolean>) {
      state.train_text_encoder = action.payload;
    },
    setSampleBatchSize(state, action: PayloadAction<number>) {
      state.sample_batch_size = action.payload;
    },
    setMaxTrainSteps(state, action: PayloadAction<number>) {
      state.max_train_steps = action.payload;
    },
    setCheckpointingSteps(state, action: PayloadAction<number>) {
      state.checkpointing_steps = action.payload;
    },
    setCheckpointsTotalLimit(state, action: PayloadAction<number | string>) {
      state.checkpoints_total_limit = action.payload;
    },
    setResumeFromCheckpoint(state, action: PayloadAction<string>) {
      state.resume_from_checkpoint = action.payload;
    },
    setGradientAccumulationSteps(state, action: PayloadAction<number>) {
      state.gradient_accumulation_steps = action.payload;
    },
    setGradientCheckpointing(state, action: PayloadAction<boolean>) {
      state.gradient_checkpointing = action.payload;
    },
    setScaleLR(state, action: PayloadAction<boolean>) {
      state.scale_lr = action.payload;
    },
    setLRScheduler(state, action: PayloadAction<string>) {
      state.lr_scheduler = action.payload;
    },
    setLRWarmupSteps(state, action: PayloadAction<number>) {
      state.lr_warmup_steps = action.payload;
    },
    setLRNumCycles(state, action: PayloadAction<number>) {
      state.lr_num_cycles = action.payload;
    },
    setLRPower(state, action: PayloadAction<number>) {
      state.lr_power = action.payload;
    },
    setUse8bitAdam(state, action: PayloadAction<boolean>) {
      state.use_8bit_adam = action.payload;
    },
    setDataloaderNumWorkers(state, action: PayloadAction<number>) {
      state.dataloader_num_workers = action.payload;
    },
    setAdamBeta1(state, action: PayloadAction<number>) {
      state.adam_beta1 = action.payload;
    },
    setAdamBeta2(state, action: PayloadAction<number>) {
      state.adam_beta2 = action.payload;
    },
    setAdamWeightDecay(state, action: PayloadAction<number>) {
      state.adam_weight_decay = action.payload;
    },
    setAdamEpsilon(state, action: PayloadAction<number>) {
      state.adam_epsilon = action.payload;
    },
    setMaxGradNorm(state, action: PayloadAction<number>) {
      state.max_grad_norm = action.payload;
    },
    setPushToHub(state, action: PayloadAction<boolean>) {
      state.push_to_hub = action.payload;
    },
    setHubToken(state, action: PayloadAction<string>) {
      state.hub_token = action.payload;
    },
    setHubModelId(state, action: PayloadAction<string>) {
      state.hub_model_id = action.payload;
    },
    setLoggingDir(state, action: PayloadAction<string>) {
      state.logging_dir = action.payload;
    },
    setAllowTF32(state, action: PayloadAction<boolean>) {
      state.allow_tf32 = action.payload;
    },
    setReportTo(state, action: PayloadAction<string>) {
      state.report_to = action.payload;
    },
    setValidationPrompt(state, action: PayloadAction<string>) {
      state.validation_prompt = action.payload;
    },
    setNumValidationImages(state, action: PayloadAction<number>) {
      state.num_validation_images = action.payload;
    },
    setValidationSteps(state, action: PayloadAction<number>) {
      state.validation_steps = action.payload;
    },
    setMixedPrecision(state, action: PayloadAction<string | undefined>) {
      state.mixed_precision = action.payload;
    },
    setPriorGenerationPrecision(state, action: PayloadAction<string>) {
      state.prior_generation_precision = action.payload;
    },
    setLocalRank(state, action: PayloadAction<number>) {
      state.local_rank = action.payload;
    },
    setEnableXformersMemoryEfficientAttention(state, action: PayloadAction<boolean>) {
      state.enable_xformers_memory_efficient_attention = action.payload;
    },
    setSetGradsToNone(state, action: PayloadAction<boolean>) {
      state.set_grads_to_none = action.payload;
    },
    setOffsetNoise(state, action: PayloadAction<boolean>) {
      state.offset_noise = action.payload;
    },
    setSNRGamma(state, action: PayloadAction<number>) {
      state.snr_gamma = action.payload;
    },
    setPreComputeTextEmbeddings(state, action: PayloadAction<boolean>) {
      state.pre_compute_text_embeddings = action.payload;
    },
    setTokenizerMaxLength(state, action: PayloadAction<number>) {
      state.tokenizer_max_length = action.payload;
    },
    setTextEncoderUseAttentionMask(state, action: PayloadAction<boolean>) {
      state.text_encoder_use_attention_mask = action.payload;
    },
    setSkipSaveTextEncoder(state, action: PayloadAction<boolean>) {
      state.skip_save_text_encoder = action.payload;
    },
    setValidationImages(state, action: PayloadAction<string>) {
      state.validation_images = action.payload;
    },
    setInstanceImageList(state, action: PayloadAction<string[]>) {
      state.instance_image_list = action.payload;
    },
    setClassImageList(state, action: PayloadAction<string[]>) {
      state.class_image_list = action.payload;
    }
  }
});

export const {
  setMemberId,
  setTrainModelName,
  setModel,
  setInstancePrompt,
  setClassPrompt,
  setResolution,
  setTrainBatchSize,
  setNumTrainEpochs,
  setLearningRate,
  setRevision,
  setVariant,
  setTokenizerName,
  setWithPriorPreservation,
  setPriorLossWeight,
  setSeed,
  setCenterCrop,
  setTrainTextEncoder,
  setSampleBatchSize,
  setMaxTrainSteps,
  setCheckpointingSteps,
  setCheckpointsTotalLimit,
  setResumeFromCheckpoint,
  setGradientAccumulationSteps,
  setGradientCheckpointing,
  setScaleLR,
  setLRScheduler,
  setLRWarmupSteps,
  setLRNumCycles,
  setLRPower,
  setUse8bitAdam,
  setDataloaderNumWorkers,
  setAdamBeta1,
  setAdamBeta2,
  setAdamWeightDecay,
  setAdamEpsilon,
  setMaxGradNorm,
  setPushToHub,
  setHubToken,
  setHubModelId,
  setLoggingDir,
  setAllowTF32,
  setReportTo,
  setValidationPrompt,
  setNumValidationImages,
  setValidationSteps,
  setMixedPrecision,
  setPriorGenerationPrecision,
  setLocalRank,
  setEnableXformersMemoryEfficientAttention,
  setSetGradsToNone,
  setOffsetNoise,
  setSNRGamma,
  setPreComputeTextEmbeddings,
  setTokenizerMaxLength,
  setTextEncoderUseAttentionMask,
  setSkipSaveTextEncoder,
  setValidationImages,
  setInstanceImageList,
  setClassImageList
} = trainingSlice.actions;

export default trainingSlice.reducer;
