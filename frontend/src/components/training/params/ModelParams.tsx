import { Input, Checkbox, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setIsInpaint,
  setFindHuggingFace,
  setPretrainedModelNameOrPath,
  setTrainModelName,
  setTokenizerName,
  setRevision
} from '../../../store/slices/training/trainingSlice';

const ModelParams = () => {
  const dispatch = useDispatch();

  const { isInpaint, findHuggingFace, pretrainedModelNameOrPath, trainModelName, tokenizerName, revision } =
    useSelector((state: RootState) => state.training.params.modelParams);

  return (
    <>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Model Parameters</h3>
      <Form layout="vertical">
        {/* isInpaint */}
        <Form.Item valuePropName="checked">
          <Checkbox checked={isInpaint} onChange={(e) => dispatch(setIsInpaint(e.target.checked))}>
            Inpaint Model Learning
          </Checkbox>
        </Form.Item>

        {/* findHuggingFace */}
        <Form.Item valuePropName="checked">
          <Checkbox checked={findHuggingFace} onChange={(e) => dispatch(setFindHuggingFace(e.target.checked))}>
            Hugging face model
          </Checkbox>
        </Form.Item>

        {/* pretrainedModelNameOrPath */}
        <Form.Item label="Pretrained Model Name or Path" required>
          <Input
            placeholder="Enter pretrained model name or path"
            value={pretrainedModelNameOrPath}
            onChange={(e) => dispatch(setPretrainedModelNameOrPath(e.target.value))}
          />
        </Form.Item>

        {/* trainModelName */}
        <Form.Item label="Train Model Name" required>
          <Input
            placeholder="Enter  train model name"
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
