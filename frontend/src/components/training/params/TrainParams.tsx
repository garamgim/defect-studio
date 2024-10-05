import { InputNumber, Checkbox, Form, Select } from 'antd';
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
  setSeed,
  setTrainTextEncoder
} from '../../../store/slices/training/trainingSlice';

const { Option } = Select;

const TrainParams = () => {
  const dispatch = useDispatch();

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
    seed,
    trainTextEncoder
  } = useSelector((state: RootState) => state.training.params.trainingParams);

  return (
    <>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Training Parameters</h3>
      <Form layout="horizontal">
        {/* Train Batch Size */}
        <Form.Item label="Train Batch Size:" required>
          <InputNumber
            placeholder="Enter Train Batch Size"
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
        <Form.Item label="Number of Epochs:" required>
          <InputNumber
            placeholder="Enter Number of Epochs"
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
        <Form.Item label="Learning Rate:" required>
          <InputNumber
            placeholder="Enter Learning Rate"
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
        <Form.Item label="Max Train Steps:">
          <InputNumber
            placeholder="Enter Max Train Steps"
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
        <Form.Item label="Gradient Accumulation Steps:">
          <InputNumber
            placeholder="Enter Gradient Accumulation Steps"
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
        <Form.Item label="Scale Learning Rate:" valuePropName="checked">
          <Checkbox checked={scaleLr} onChange={(e) => dispatch(setScaleLr(e.target.checked))} />
        </Form.Item>

        {/* Learning Rate Scheduler */}
        <Form.Item label="LR Scheduler:">
          <Select
            placeholder="Select LR Scheduler"
            className="w-full"
            value={lrScheduler || undefined}
            onChange={(value) => {
              dispatch(
                setLrScheduler(
                  value as
                    | 'linear'
                    | 'cosine'
                    | 'cosine_with_restarts'
                    | 'polynomial'
                    | 'constant'
                    | 'constant_with_warmup'
                )
              );
            }}
          >
            <Option value="linear">Linear</Option>
            <Option value="cosine">Cosine</Option>
            <Option value="cosine_with_restarts">Cosine with Restarts</Option>
            <Option value="polynomial">Polynomial</Option>
            <Option value="constant">Constant</Option>
            <Option value="constant_with_warmup">Constant with Warmup</Option>
          </Select>
        </Form.Item>

        {/* LR Warmup Steps */}
        <Form.Item label="LR Warmup Steps:">
          <InputNumber
            placeholder="Enter LR Warmup Steps"
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
        <Form.Item label="LR Cycles:">
          <InputNumber
            placeholder="Enter LR Cycles"
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
        <Form.Item label="LR Power:">
          <InputNumber
            placeholder="Enter LR Power"
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
        <Form.Item label="Use 8-bit Adam Optimizer:" valuePropName="checked">
          <Checkbox checked={use8bitAdam} onChange={(e) => dispatch(setUse8bitAdam(e.target.checked))} />
        </Form.Item>

        {/* Gradient Checkpointing */}
        <Form.Item label="Gradient Checkpointing:" valuePropName="checked">
          <Checkbox
            checked={gradientCheckpointing}
            onChange={(e) => dispatch(setGradientCheckpointing(e.target.checked))}
          />
        </Form.Item>

        {/* Seed */}
        <Form.Item label="Seed:">
          <InputNumber
            placeholder="Enter Seed"
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
        <Form.Item label="Train Text Encoder:" valuePropName="checked">
          <Checkbox checked={trainTextEncoder} onChange={(e) => dispatch(setTrainTextEncoder(e.target.checked))} />
        </Form.Item>
      </Form>
    </>
  );
};

export default TrainParams;
