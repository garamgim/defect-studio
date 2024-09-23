import React from 'react';
import { Input, Select, Checkbox, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setTrainModelName,
  setModel,
  setRevision,
  setVariant,
  setTokenizerName,
  setHubModelId,
  setPushToHub,
  setHubToken
} from '../../../store/slices/training/trainingSlice';

const { Option } = Select;

const ModelParams = () => {
  const dispatch = useDispatch();

  const { trainModelName, model, revision, variant, tokenizerName, hubModelId, pushToHub, hubToken } = useSelector(
    (state: RootState) => state.training
  );

  return (
    <>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Model Parameters</h3>
      <Form layout="vertical">
        {/* Train Model Name */}
        <Form.Item label="Train Model Name" required>
          <Input
            placeholder="Enter model name"
            value={trainModelName}
            onChange={(e) => dispatch(setTrainModelName(e.target.value))}
          />
        </Form.Item>

        {/* Model */}
        <Form.Item label="Model" required>
          <Select placeholder="Select a model" value={model} onChange={(value) => dispatch(setModel(value))}>
            <Option value="stable-diffusion">Stable Diffusion</Option>
            <Option value="gpt-3">GPT-3</Option>
          </Select>
        </Form.Item>

        {/* Revision */}
        <Form.Item label="Revision">
          <Input placeholder="Revision" value={revision} onChange={(e) => dispatch(setRevision(e.target.value))} />
        </Form.Item>

        {/* Variant */}
        <Form.Item label="Variant">
          <Input
            placeholder="Variant (e.g., fp16)"
            value={variant}
            onChange={(e) => dispatch(setVariant(e.target.value))}
          />
        </Form.Item>

        {/* Tokenizer Name */}
        <Form.Item label="Tokenizer Name">
          <Input
            placeholder="Tokenizer Name"
            value={tokenizerName}
            onChange={(e) => dispatch(setTokenizerName(e.target.value))}
          />
        </Form.Item>

        {/* Hub Model ID */}
        <Form.Item label="Hub Model ID">
          <Input
            placeholder="Hub Model ID"
            value={hubModelId}
            onChange={(e) => dispatch(setHubModelId(e.target.value))}
          />
        </Form.Item>

        {/* Push to Hub */}
        <Form.Item label="Push to Hub" valuePropName="checked">
          <Checkbox checked={pushToHub} onChange={(e) => dispatch(setPushToHub(e.target.checked))}>
            Push to Hub
          </Checkbox>
        </Form.Item>

        {/* Hub Token */}
        <Form.Item label="Hub Token">
          <Input placeholder="Hub Token" value={hubToken} onChange={(e) => dispatch(setHubToken(e.target.value))} />
        </Form.Item>
      </Form>
    </>
  );
};

export default React.memo(ModelParams);
