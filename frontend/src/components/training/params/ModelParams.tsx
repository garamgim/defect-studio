// *train_model_name: 훈련할 모델 이름
// *model: 모델
// revision: 모델의 버전 (사용 안함일 경우 무시)
// variant: 모델 변형 (예: fp16)
// tokenizer_name: 토크나이저 이름
// hub_model_id: Hub에 모델을 업로드할 경우 필요한 ID
// push_to_hub: 모델을 Hub에 푸시할지 여부 (hub_model_id있는 경우)
// hub_token: Hub에 업로드할 때 사용할 토큰 (hub_model_id있는 경우)

import React from 'react';
import { Input, Select, Checkbox, Form } from 'antd';

const { Option } = Select;

const ModelParams = () => {
  return (
    <div className="overflow-y-auto custom-scrollbar">
      <h3 className="text-lg font-bold mb-4">Model Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="Train Model Name" required>
          <Input placeholder="Enter model name" />
        </Form.Item>

        <Form.Item label="Model" required>
          <Select placeholder="Select a model">
            <Option value="stable-diffusion">Stable Diffusion</Option>
            <Option value="gpt-3">GPT-3</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Revision">
          <Input placeholder="Revision" />
        </Form.Item>

        <Form.Item label="Variant">
          <Input placeholder="Variant (e.g., fp16)" />
        </Form.Item>

        <Form.Item label="Tokenizer Name">
          <Input placeholder="Tokenizer Name" />
        </Form.Item>

        <Form.Item label="Hub Model ID">
          <Input placeholder="Hub Model ID" />
        </Form.Item>

        <Form.Item label="Push to Hub" valuePropName="checked">
          <Checkbox>Push to Hub</Checkbox>
        </Form.Item>

        <Form.Item label="Hub Token">
          <Input placeholder="Hub Token" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ModelParams);
