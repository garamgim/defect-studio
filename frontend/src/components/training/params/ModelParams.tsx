import { Input, Checkbox, Form, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setIsInpaint,
  setPretrainedModelNameOrPath,
  setTrainModelName,
  setTokenizerName,
  setRevision,
  setGpuNum
} from '../../../store/slices/training/trainingSlice';

const { Option } = Select;

const ModelParams = () => {
  const dispatch = useDispatch();

  const { isInpaint, pretrainedModelNameOrPath, trainModelName, tokenizerName, revision } = useSelector(
    (state: RootState) => state.training.params.modelParams
  );

  const gpuNum = useSelector((state: RootState) => state.training.gpuNum);

  const inpaintModels = ['stable-diffusion-2-inpainting'];
  const otherModels = ['stable-diffusion-2', 'stable-diffusion-v1-5', 'stable-diffusion-v1-4'];

  const handleModelChange = (value: string) => {
    dispatch(setPretrainedModelNameOrPath(value));
  };

  const handleInpaintChange = (checked: boolean) => {
    dispatch(setIsInpaint(checked));
    // isInpaint 변경될 때 pretrainedModelNameOrPath 초기화
    dispatch(setPretrainedModelNameOrPath(''));
  };

  return (
    <>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Model Parameters</h3>
      <Form layout="horizontal">
        {/* gpuNum */}
        <Form.Item label="Gpu number">
          <Input
            type="number"
            min={0}
            placeholder="Enter gpu number"
            value={gpuNum !== undefined ? String(gpuNum) : ''}
            onChange={(e) => dispatch(setGpuNum(Number(e.target.value)))}
          />
        </Form.Item>

        {/* isInpaint */}
        <Form.Item label="Inpaint Model Learning" valuePropName="checked">
          <Checkbox checked={isInpaint} onChange={(e) => handleInpaintChange(e.target.checked)} />
        </Form.Item>

        {/* Pretrained Model Name or Path */}
        <Form.Item label="Pretrained Model Name or Path" required>
          <Select
            placeholder="Select a model"
            value={pretrainedModelNameOrPath || undefined} // undefined: 초기화된 상태
            onChange={handleModelChange}
          >
            {isInpaint
              ? inpaintModels.map((model) => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))
              : otherModels.map((model) => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))}
          </Select>
        </Form.Item>

        {/* trainModelName */}
        <Form.Item label="Train Model Name" required>
          <Input
            placeholder="Enter train model name"
            value={trainModelName}
            onChange={(e) => dispatch(setTrainModelName(e.target.value))}
          />
        </Form.Item>

        {/* tokenizerName */}
        <Form.Item label="Tokenizer Name">
          <Input
            placeholder="Enter tokenizer name"
            value={tokenizerName}
            onChange={(e) => dispatch(setTokenizerName(e.target.value))}
          />
        </Form.Item>

        {/* revision */}
        <Form.Item label="Revision">
          <Input
            placeholder="Enter revision"
            value={revision}
            onChange={(e) => dispatch(setRevision(e.target.value))}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default ModelParams;
