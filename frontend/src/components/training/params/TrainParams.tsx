// *train_batch_size: 훈련 배치 크기
// *num_train_epochs: 에폭 수
// *learning_rate: 학습률
// max_train_steps: 최대 학습 스텝
// gradient_accumulation_steps: 그래디언트 누적 스텝 수
// scale_lr: 학습률 스케일링 여부
// lr_scheduler: 학습률 스케줄러
// lr_warmup_steps: 학습률 워밍업 스텝 수
// lr_num_cycles: 스케줄러 사이클 수
// lr_power: 다항식 스케줄러에서의 파워 팩터 (lr_scheduler가 "polynomial"일 때만)
// use_8bit_adam: 8비트 Adam 옵티마이저 사용 여부
// gradient_checkpointing: 그래디언트 체크포인팅 여부
// with_prior_preservation: 사전 보존 손실 적용 여부
// prior_loss_weight: 사전 보존 손실의 가중치
// seed: 재현성을 위한 시드 값
// train_text_encoder: 텍스트 인코더를 학습할지 여부

import React from 'react';
import { InputNumber, Checkbox, Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
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
  setWithPriorPreservation,
  setPriorLossWeight,
  setSeed,
  setTrainTextEncoder
} from '../../../store/slices/training/trainingSlice';

const TrainParams = () => {
  const dispatch = useDispatch();

  // Redux 상태에서 필요한 값들을 가져옴
  const {
    trainBatchSize,
    numTrainEpochs,
    learningRate,
    maxTrainSteps,
    gradientAccumulationSteps,
    scaleLr,
    lrScheduler,
    lrWarmupSteps,
    lrNumCycles,
    lrPower,
    use8bitAdam,
    gradientCheckpointing,
    withPriorPreservation,
    priorLossWeight,
    seed,
    trainTextEncoder
  } = useSelector((state: RootState) => state.training);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Training Parameters</h3>
      <Form layout="vertical">
        {/* Train Batch Size */}
        <Form.Item label="Train Batch Size">
          <InputNumber
            placeholder="Train Batch Size"
            className="w-full"
            value={trainBatchSize}
            onChange={(value) => {
              if (value) {
                dispatch(setTrainBatchSize(value));
              }
            }}
          />
        </Form.Item>

        {/* Number of Epochs */}
        <Form.Item label="Number of Epochs">
          <InputNumber
            placeholder="Number of Epochs"
            className="w-full"
            value={numTrainEpochs}
            onChange={(value) => {
              if (value) {
                dispatch(setNumTrainEpochs(value));
              }
            }}
          />
        </Form.Item>

        {/* Learning Rate */}
        <Form.Item label="Learning Rate">
          <InputNumber
            placeholder="Learning Rate"
            className="w-full"
            value={learningRate}
            onChange={(value) => {
              if (value) {
                dispatch(setLearningRate(value));
              }
            }}
          />
        </Form.Item>

        {/* Max Train Steps */}
        <Form.Item label="Max Train Steps">
          <InputNumber
            placeholder="Max Train Steps"
            className="w-full"
            value={maxTrainSteps}
            onChange={(value) => {
              if (value) {
                dispatch(setMaxTrainSteps(value));
              }
            }}
          />
        </Form.Item>

        {/* Gradient Accumulation Steps */}
        <Form.Item label="Gradient Accumulation Steps">
          <InputNumber
            placeholder="Gradient Accumulation Steps"
            className="w-full"
            value={gradientAccumulationSteps}
            onChange={(value) => {
              if (value) {
                dispatch(setGradientAccumulationSteps(value));
              }
            }}
          />
        </Form.Item>

        {/* Scale Learning Rate */}
        <Form.Item label="Scale Learning Rate" valuePropName="checked">
          <Checkbox checked={scaleLr} onChange={(e) => dispatch(setScaleLr(e.target.checked))} />
        </Form.Item>

        {/* Learning Rate Scheduler */}
        <Form.Item label="Learning Rate Scheduler">
          <Input
            placeholder="LR Scheduler"
            className="w-full"
            value={lrScheduler}
            onChange={(e) => dispatch(setLrScheduler(e.target.value))}
          />
        </Form.Item>

        {/* LR Warmup Steps */}
        <Form.Item label="LR Warmup Steps">
          <InputNumber
            placeholder="LR Warmup Steps"
            className="w-full"
            value={lrWarmupSteps}
            onChange={(value) => {
              if (value) {
                dispatch(setLrWarmupSteps(value));
              }
            }}
          />
        </Form.Item>

        {/* LR Cycles */}
        <Form.Item label="LR Cycles">
          <InputNumber
            placeholder="LR Cycles"
            className="w-full"
            value={lrNumCycles}
            onChange={(value) => {
              if (value) {
                dispatch(setLrNumCycles(value));
              }
            }}
          />
        </Form.Item>

        {/* LR Power */}
        <Form.Item label="LR Power">
          <InputNumber
            placeholder="LR Power"
            className="w-full"
            value={lrPower}
            onChange={(value) => {
              if (value) {
                dispatch(setLrPower(value));
              }
            }}
          />
        </Form.Item>

        {/* Use 8-bit Adam Optimizer */}
        <Form.Item label="Use 8-bit Adam Optimizer" valuePropName="checked">
          <Checkbox checked={use8bitAdam} onChange={(e) => dispatch(setUse8bitAdam(e.target.checked))} />
        </Form.Item>

        {/* Gradient Checkpointing */}
        <Form.Item label="Gradient Checkpointing" valuePropName="checked">
          <Checkbox
            checked={gradientCheckpointing}
            onChange={(e) => dispatch(setGradientCheckpointing(e.target.checked))}
          />
        </Form.Item>

        {/* With Prior Preservation */}
        <Form.Item label="With Prior Preservation" valuePropName="checked">
          <Checkbox
            checked={withPriorPreservation}
            onChange={(e) => dispatch(setWithPriorPreservation(e.target.checked))}
          />
        </Form.Item>

        {/* Prior Loss Weight */}
        <Form.Item label="Prior Loss Weight">
          <InputNumber
            placeholder="Prior Loss Weight"
            className="w-full"
            value={priorLossWeight}
            onChange={(value) => {
              if (value) {
                dispatch(setPriorLossWeight(value));
              }
            }}
          />
        </Form.Item>

        {/* Seed */}
        <Form.Item label="Seed">
          <InputNumber
            placeholder="Seed"
            className="w-full"
            value={seed}
            onChange={(value) => {
              if (value) {
                dispatch(setSeed(value));
              }
            }}
          />
        </Form.Item>

        {/* Train Text Encoder */}
        <Form.Item label="Train Text Encoder" valuePropName="checked">
          <Checkbox checked={trainTextEncoder} onChange={(e) => dispatch(setTrainTextEncoder(e.target.checked))} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(TrainParams);
