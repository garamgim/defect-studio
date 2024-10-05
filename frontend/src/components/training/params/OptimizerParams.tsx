import { InputNumber, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setAdamBeta1,
  setAdamBeta2,
  setAdamWeightDecay,
  setAdamEpsilon,
  setMaxGradNorm
} from '../../../store/slices/training/trainingSlice';

const OptimizerParams = () => {
  const dispatch = useDispatch();

  // Redux 상태에서 필요한 값 가져오기
  const { adamBeta1, adamBeta2, adamWeightDecay, adamEpsilon, maxGradNorm } = useSelector(
    (state: RootState) => state.training.params.optimizerParams
  );

  return (
    <>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Optimizer Parameters</h3>
      <Form layout="horizontal">
        {/* Adam Beta 1 */}
        <Form.Item label="Adam Beta 1">
          <InputNumber
            placeholder="Adam Beta 1"
            className="w-full"
            value={adamBeta1}
            onChange={(value) => {
              if (value) {
                dispatch(setAdamBeta1(value));
              }
            }}
          />
        </Form.Item>

        {/* Adam Beta 2 */}
        <Form.Item label="Adam Beta 2">
          <InputNumber
            placeholder="Adam Beta 2"
            className="w-full"
            value={adamBeta2}
            onChange={(value) => {
              if (value) {
                dispatch(setAdamBeta2(value));
              }
            }}
          />
        </Form.Item>

        {/* Adam Weight Decay */}
        <Form.Item label="Adam Weight Decay">
          <InputNumber
            placeholder="Enter Weight Decay"
            className="w-full"
            value={adamWeightDecay}
            onChange={(value) => {
              if (value) {
                dispatch(setAdamWeightDecay(value));
              }
            }}
          />
        </Form.Item>

        {/* Adam Epsilon */}
        <Form.Item label="Adam Epsilon">
          <InputNumber
            placeholder="Enter Epsilon Value"
            className="w-full"
            value={adamEpsilon}
            onChange={(value) => {
              if (value) {
                dispatch(setAdamEpsilon(value));
              }
            }}
          />
        </Form.Item>

        {/* Max Gradient Norm */}
        <Form.Item label="Max Gradient Norm">
          <InputNumber
            placeholder="Enter Max Gradient Norm"
            className="w-full"
            value={maxGradNorm}
            onChange={(value) => {
              if (value) {
                dispatch(setMaxGradNorm(value));
              }
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default OptimizerParams;
