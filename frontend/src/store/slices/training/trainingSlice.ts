import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrainingParams } from '../../../types/training';
import { SnakeToCamel } from '../../../utils/snakeToCamel';

export interface TrainingState extends SnakeToCamel<TrainingParams> {}

const initialState: TrainingState = {
  memberId: -1,
  trainModelName: '',
  model: 'stable-diffusion-2', // 드롭다운
  instancePrompt: '', // 범주 중에 특징(선 잘린 케이블)
  classPrompt: '', // 큰 범주(케이블)
  resolution: 512, // 학습할 이미지 크기
  trainBatchSize: 8,
  numTrainEpochs: 10,
  learningRate: 0.001, // 0과 1사이 실수

  revision: '', // 모델의 버전 <- 여기서는 사용x
  variant: '', // ?????????(이거 드롭다운 같은데 적는 양식이 정해져 있을 것 같음)
  tokenizerName: '', // 이거 경로?? 어디
  withPriorPreservation: false,
  priorLossWeight: 0, // withPriorPreservation: true일 때 작성
  seed: 42, // 해당 시드로 재현성 테스트
  centerCrop: false,
  trainTextEncoder: false, // ?? textEncoder학습 왜 default false??
  sampleBatchSize: 4,
  maxTrainSteps: 1000,
  checkpointingSteps: 500,
  checkpointsTotalLimit: -1, // default: None 맞는지 확인!
  resumeFromCheckpoint: '', //경로 "none, latest, path"
  gradientAccumulationSteps: 1,
  gradientCheckpointing: false,
  scaleLr: true,
  lrScheduler: 'linear', // 드롭다운 <- ""은 뭔지? ("", "constant", "linear", "cosine", "cosineWithRestarts", "polynomial", "constantWithWarmup")
  lrWarmupSteps: 0,
  lrNumCycles: 1,
  lrPower: 1.0, // lrScheduler가 polynomial일때만 넣어야함
  use8bitAdam: false,
  dataloaderNumWorkers: 4,
  adamBeta1: 0.9,
  adamBeta2: 0.999,
  adamWeightDecay: 0.01,
  adamEpsilon: 1e-8,
  maxGradNorm: 1.0,
  pushToHub: false, // 이거 가능한건가?????????
  hubToken: '', //pushToHub있으면 넣어야함
  hubModelId: '', //pushToHub있으면 넣어야함
  loggingDir: '', // 이 디렉토리는??? 지정안하면 어디에 저장? 뭔지모르겠음
  allowTf32: true,
  reportTo: 'none', // 이것도 뭐지
  validationPrompt: '', // 검증을 위한 프롬프트 예시??
  numValidationImages: 5,
  validationSteps: 100,
  mixedPrecision: '', // 드롭다운 (fp16, bf16) <- 기본값뭔지 데이터 안보낼때 뭘로 들어가고 있는지
  priorGenerationPrecision: '', // 드롭다운 (fp16, fp32 또는 bf16) <- 기본값뭔지
  localRank: -1,
  enableXformersMemoryEfficientAttention: false,
  setGradsToNone: false,
  offsetNoise: false,
  snrGamma: 5.0,
  preComputeTextEmbeddings: false,
  tokenizerMaxLength: 512, // 이거 기본값 맞는지 확인
  textEncoderUseAttentionMask: true,
  skipSaveTextEncoder: false,
  validationImages: '', //왜 문자열??????????
  instanceImageList: [],
  classImageList: [],
  classLabelsConditioning: '',
  validationScheduler: ''
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setMemberId(state, action: PayloadAction<number>) {
      state.memberId = action.payload;
    },
    setTrainModelName(state, action: PayloadAction<string>) {
      state.trainModelName = action.payload;
    },
    setModel(state, action: PayloadAction<string>) {
      state.model = action.payload;
    },
    setInstancePrompt(state, action: PayloadAction<string>) {
      state.instancePrompt = action.payload;
    },
    setClassPrompt(state, action: PayloadAction<string>) {
      state.classPrompt = action.payload;
    },
    setResolution(state, action: PayloadAction<number>) {
      state.resolution = action.payload;
    },
    setTrainBatchSize(state, action: PayloadAction<number>) {
      state.trainBatchSize = action.payload;
    },
    setNumTrainEpochs(state, action: PayloadAction<number>) {
      state.numTrainEpochs = action.payload;
    },
    setLearningRate(state, action: PayloadAction<number>) {
      state.learningRate = action.payload;
    },
    setRevision(state, action: PayloadAction<string>) {
      state.revision = action.payload;
    },
    setVariant(state, action: PayloadAction<string>) {
      state.variant = action.payload;
    },
    setTokenizerName(state, action: PayloadAction<string>) {
      state.tokenizerName = action.payload;
    },
    setWithPriorPreservation(state, action: PayloadAction<boolean>) {
      state.withPriorPreservation = action.payload;
    },
    setPriorLossWeight(state, action: PayloadAction<number>) {
      state.priorLossWeight = action.payload;
    },
    setSeed(state, action: PayloadAction<number>) {
      state.seed = action.payload;
    },
    setCenterCrop(state, action: PayloadAction<boolean>) {
      state.centerCrop = action.payload;
    },
    setTrainTextEncoder(state, action: PayloadAction<boolean>) {
      state.trainTextEncoder = action.payload;
    },
    setSampleBatchSize(state, action: PayloadAction<number>) {
      state.sampleBatchSize = action.payload;
    },
    setMaxTrainSteps(state, action: PayloadAction<number>) {
      state.maxTrainSteps = action.payload;
    },
    setCheckpointingSteps(state, action: PayloadAction<number>) {
      state.checkpointingSteps = action.payload;
    },
    setCheckpointsTotalLimit(state, action: PayloadAction<number>) {
      state.checkpointsTotalLimit = action.payload;
    },
    setResumeFromCheckpoint(state, action: PayloadAction<string>) {
      state.resumeFromCheckpoint = action.payload;
    },
    setGradientAccumulationSteps(state, action: PayloadAction<number>) {
      state.gradientAccumulationSteps = action.payload;
    },
    setGradientCheckpointing(state, action: PayloadAction<boolean>) {
      state.gradientCheckpointing = action.payload;
    },
    setScaleLr(state, action: PayloadAction<boolean>) {
      state.scaleLr = action.payload;
    },
    setLrScheduler(state, action: PayloadAction<string>) {
      state.lrScheduler = action.payload;
    },
    setLrWarmupSteps(state, action: PayloadAction<number>) {
      state.lrWarmupSteps = action.payload;
    },
    setLrNumCycles(state, action: PayloadAction<number>) {
      state.lrNumCycles = action.payload;
    },
    setLrPower(state, action: PayloadAction<number>) {
      state.lrPower = action.payload;
    },
    setUse8bitAdam(state, action: PayloadAction<boolean>) {
      state.use8bitAdam = action.payload;
    },
    setDataloaderNumWorkers(state, action: PayloadAction<number>) {
      state.dataloaderNumWorkers = action.payload;
    },
    setAdamBeta1(state, action: PayloadAction<number>) {
      state.adamBeta1 = action.payload;
    },
    setAdamBeta2(state, action: PayloadAction<number>) {
      state.adamBeta2 = action.payload;
    },
    setAdamWeightDecay(state, action: PayloadAction<number>) {
      state.adamWeightDecay = action.payload;
    },
    setAdamEpsilon(state, action: PayloadAction<number>) {
      state.adamEpsilon = action.payload;
    },
    setMaxGradNorm(state, action: PayloadAction<number>) {
      state.maxGradNorm = action.payload;
    },
    setPushToHub(state, action: PayloadAction<boolean>) {
      state.pushToHub = action.payload;
    },
    setHubToken(state, action: PayloadAction<string>) {
      state.hubToken = action.payload;
    },
    setHubModelId(state, action: PayloadAction<string>) {
      state.hubModelId = action.payload;
    },
    setLoggingDir(state, action: PayloadAction<string>) {
      state.loggingDir = action.payload;
    },
    setAllowTf32(state, action: PayloadAction<boolean>) {
      state.allowTf32 = action.payload;
    },
    setReportTo(state, action: PayloadAction<string>) {
      state.reportTo = action.payload;
    },
    setValidationPrompt(state, action: PayloadAction<string>) {
      state.validationPrompt = action.payload;
    },
    setNumValidationImages(state, action: PayloadAction<number>) {
      state.numValidationImages = action.payload;
    },
    setValidationSteps(state, action: PayloadAction<number>) {
      state.validationSteps = action.payload;
    },
    setMixedPrecision(state, action: PayloadAction<string>) {
      state.mixedPrecision = action.payload;
    },
    setPriorGenerationPrecision(state, action: PayloadAction<string>) {
      state.priorGenerationPrecision = action.payload;
    },
    setLocalRank(state, action: PayloadAction<number>) {
      state.localRank = action.payload;
    },
    setEnableXformersMemoryEfficientAttention(state, action: PayloadAction<boolean>) {
      state.enableXformersMemoryEfficientAttention = action.payload;
    },
    setSetGradsToNone(state, action: PayloadAction<boolean>) {
      state.setGradsToNone = action.payload;
    },
    setOffsetNoise(state, action: PayloadAction<boolean>) {
      state.offsetNoise = action.payload;
    },
    setSnrGamma(state, action: PayloadAction<number>) {
      state.snrGamma = action.payload;
    },
    setPreComputeTextEmbeddings(state, action: PayloadAction<boolean>) {
      state.preComputeTextEmbeddings = action.payload;
    },
    setTokenizerMaxLength(state, action: PayloadAction<number>) {
      state.tokenizerMaxLength = action.payload;
    },
    setTextEncoderUseAttentionMask(state, action: PayloadAction<boolean>) {
      state.textEncoderUseAttentionMask = action.payload;
    },
    setSkipSaveTextEncoder(state, action: PayloadAction<boolean>) {
      state.skipSaveTextEncoder = action.payload;
    },
    setValidationImages(state, action: PayloadAction<string>) {
      state.validationImages = action.payload;
    },
    setInstanceImageList(state, action: PayloadAction<string[]>) {
      state.instanceImageList = action.payload;
    },
    setClassImageList(state, action: PayloadAction<string[]>) {
      state.classImageList = action.payload;
    },
    setValidationScheduler(state, action: PayloadAction<string>) {
      state.validationScheduler = action.payload;
    },
    setClassLabelsConditioning(state, action: PayloadAction<string>) {
      state.classLabelsConditioning = action.payload;
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
  setScaleLr,
  setLrScheduler,
  setLrWarmupSteps,
  setLrNumCycles,
  setLrPower,
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
  setAllowTf32,
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
  setSnrGamma,
  setPreComputeTextEmbeddings,
  setTokenizerMaxLength,
  setTextEncoderUseAttentionMask,
  setSkipSaveTextEncoder,
  setValidationImages,
  setInstanceImageList,
  setClassImageList,
  setValidationScheduler,
  setClassLabelsConditioning
} = trainingSlice.actions;

export default trainingSlice.reducer;
