import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ModelParamsType,
  ImgsParamsType,
  TrainingParamsType,
  OptimizerParamsType,
  CheckpointParamsType,
  ConceptListParamsType
} from '../../../types/training';

export interface TrainingState {
  gpuNum: number | null;
  params: {
    modelParams: ModelParamsType;
    imgsParams: ImgsParamsType;
    trainingParams: TrainingParamsType;
    optimizerParams: OptimizerParamsType;
    checkpointParams: CheckpointParamsType;
    conceptListParams: ConceptListParamsType[];
  };
  maxConcepts: number;
}

const initialState: TrainingState = {
  gpuNum: null,
  params: {
    modelParams: {
      isInpaint: false,
      findHuggingFace: false,
      pretrainedModelNameOrPath: '',
      trainModelName: '',
      tokenizerName: '',
      revision: ''
    },
    imgsParams: {
      resolution: 512,
      priorLossWeight: 1,
      centerCrop: false
    },
    trainingParams: {
      trainBatchSize: 2,
      numTrainEpochs: 50,
      learningRate: 5e-6,
      maxTrainSteps: null,
      gradientAccumulationSteps: null,
      scaleLr: false,
      lrScheduler: null,
      lrWarmupSteps: null,
      lrNumCycles: null,
      lrPower: null,
      use8bitAdam: false,
      gradientCheckpointing: false,
      seed: null,
      trainTextEncoder: false
    },
    optimizerParams: {
      adamBeta1: null,
      adamBeta2: null,
      adamWeightDecay: null,
      adamEpsilon: null,
      maxGradNorm: null
    },
    checkpointParams: {
      checkpointingSteps: null,
      checkpointsTotalLimit: null,
      resumeFromCheckpoint: ''
    },
    conceptListParams: [{ instancePrompt: '', classPrompt: '', instanceImageList: '', classImageList: '' }]
  },
  maxConcepts: 10
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setGpuNum: (state, action: PayloadAction<number | null>) => {
      state.gpuNum = action.payload;
    },

    // Model Params
    setIsInpaint: (state, action: PayloadAction<boolean>) => {
      state.params.modelParams.isInpaint = action.payload;
    },
    setFindHuggingFace: (state, action: PayloadAction<boolean>) => {
      state.params.modelParams.findHuggingFace = action.payload;
    },
    setPretrainedModelNameOrPath: (state, action: PayloadAction<string>) => {
      state.params.modelParams.pretrainedModelNameOrPath = action.payload;
    },
    setTrainModelName: (state, action: PayloadAction<string>) => {
      state.params.modelParams.trainModelName = action.payload;
    },
    setTokenizerName: (state, action: PayloadAction<string>) => {
      state.params.modelParams.tokenizerName = action.payload;
    },
    setRevision: (state, action: PayloadAction<string>) => {
      state.params.modelParams.revision = action.payload;
    },

    // Image Params
    setResolution: (state, action: PayloadAction<number>) => {
      state.params.imgsParams.resolution = action.payload;
    },
    setPriorLossWeight: (state, action: PayloadAction<number>) => {
      state.params.imgsParams.priorLossWeight = action.payload;
    },
    setCenterCrop: (state, action: PayloadAction<boolean>) => {
      state.params.imgsParams.centerCrop = action.payload;
    },

    // Training Params
    setTrainBatchSize: (state, action: PayloadAction<number>) => {
      state.params.trainingParams.trainBatchSize = action.payload;
    },
    setNumTrainEpochs: (state, action: PayloadAction<number>) => {
      state.params.trainingParams.numTrainEpochs = action.payload;
    },
    setLearningRate: (state, action: PayloadAction<number>) => {
      state.params.trainingParams.learningRate = action.payload;
    },
    setMaxTrainSteps: (state, action: PayloadAction<number | null>) => {
      state.params.trainingParams.maxTrainSteps = action.payload;
    },
    setGradientAccumulationSteps: (state, action: PayloadAction<number | null>) => {
      state.params.trainingParams.gradientAccumulationSteps = action.payload;
    },
    setScaleLr: (state, action: PayloadAction<boolean>) => {
      state.params.trainingParams.scaleLr = action.payload;
    },
    setLrScheduler: (state, action: PayloadAction<TrainingParamsType['lrScheduler']>) => {
      state.params.trainingParams.lrScheduler = action.payload;
    },
    setLrWarmupSteps: (state, action: PayloadAction<number | null>) => {
      state.params.trainingParams.lrWarmupSteps = action.payload;
    },
    setLrNumCycles: (state, action: PayloadAction<number | null>) => {
      state.params.trainingParams.lrNumCycles = action.payload;
    },
    setLrPower: (state, action: PayloadAction<number | null>) => {
      state.params.trainingParams.lrPower = action.payload;
    },
    setUse8bitAdam: (state, action: PayloadAction<boolean>) => {
      state.params.trainingParams.use8bitAdam = action.payload;
    },
    setGradientCheckpointing: (state, action: PayloadAction<boolean>) => {
      state.params.trainingParams.gradientCheckpointing = action.payload;
    },
    setSeed: (state, action: PayloadAction<number | null>) => {
      state.params.trainingParams.seed = action.payload;
    },
    setTrainTextEncoder: (state, action: PayloadAction<boolean>) => {
      state.params.trainingParams.trainTextEncoder = action.payload;
    },

    // Optimizer Params
    setAdamBeta1: (state, action: PayloadAction<number | null>) => {
      state.params.optimizerParams.adamBeta1 = action.payload;
    },
    setAdamBeta2: (state, action: PayloadAction<number | null>) => {
      state.params.optimizerParams.adamBeta2 = action.payload;
    },
    setAdamWeightDecay: (state, action: PayloadAction<number | null>) => {
      state.params.optimizerParams.adamWeightDecay = action.payload;
    },
    setAdamEpsilon: (state, action: PayloadAction<number | null>) => {
      state.params.optimizerParams.adamEpsilon = action.payload;
    },
    setMaxGradNorm: (state, action: PayloadAction<number | null>) => {
      state.params.optimizerParams.maxGradNorm = action.payload;
    },

    // Checkpoint Params
    setCheckpointingSteps: (state, action: PayloadAction<number | null>) => {
      state.params.checkpointParams.checkpointingSteps = action.payload;
    },
    setCheckpointsTotalLimit: (state, action: PayloadAction<number | null>) => {
      state.params.checkpointParams.checkpointsTotalLimit = action.payload;
    },
    setResumeFromCheckpoint: (state, action: PayloadAction<string>) => {
      state.params.checkpointParams.resumeFromCheckpoint = action.payload;
    },

    // Concept Management
    addConcept: (state) => {
      if (state.params.conceptListParams.length < state.maxConcepts) {
        state.params.conceptListParams.push({
          instanceImageList: '',
          instancePrompt: '',
          classImageList: '',
          classPrompt: ''
        });
      }
    },
    removeConcept: (state, action: PayloadAction<number>) => {
      state.params.conceptListParams.splice(action.payload, 1);
    },
    setInstancePrompt: (state, action: PayloadAction<{ index: number; prompt: string }>) => {
      state.params.conceptListParams[action.payload.index].instancePrompt = action.payload.prompt;
    },
    setClassPrompt: (state, action: PayloadAction<{ index: number; prompt: string }>) => {
      state.params.conceptListParams[action.payload.index].classPrompt = action.payload.prompt;
    },
    setInstanceImageList: (state, action: PayloadAction<{ index: number; folderPath: string }>) => {
      state.params.conceptListParams[action.payload.index].instanceImageList = action.payload.folderPath;
    },
    setClassImageList: (state, action: PayloadAction<{ index: number; folderPath: string }>) => {
      state.params.conceptListParams[action.payload.index].classImageList = action.payload.folderPath;
    }
  }
});

export const {
  setGpuNum,
  setIsInpaint,
  setFindHuggingFace,
  setPretrainedModelNameOrPath,
  setTrainModelName,
  setTokenizerName,
  setRevision,
  setResolution,
  setPriorLossWeight,
  setCenterCrop,
  setTrainBatchSize,
  setNumTrainEpochs,
  setLearningRate,
  setMaxTrainSteps,
  setGradientAccumulationSteps,
  setScaleLr,
  setLrScheduler,
  setLrWarmupSteps,
  setLrNumCycles,
  setLrPower,
  setUse8bitAdam,
  setGradientCheckpointing,
  setSeed,
  setTrainTextEncoder,
  setAdamBeta1,
  setAdamBeta2,
  setAdamWeightDecay,
  setAdamEpsilon,
  setMaxGradNorm,
  setCheckpointingSteps,
  setCheckpointsTotalLimit,
  setResumeFromCheckpoint,
  addConcept,
  removeConcept,
  setInstancePrompt,
  setClassPrompt,
  setInstanceImageList,
  setClassImageList
} = trainingSlice.actions;

export default trainingSlice.reducer;
