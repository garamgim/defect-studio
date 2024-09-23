// *train_model_name: 훈련할 모델 이름
// *model: 모델
// revision: 모델의 버전 (사용 안함일 경우 무시)
// variant: 모델 변형 (예: fp16)
// tokenizer_name: 토크나이저 이름
// hub_model_id: Hub에 모델을 업로드할 경우 필요한 ID
// push_to_hub: 모델을 Hub에 푸시할지 여부 (hub_model_id있는 경우)
// hub_token: Hub에 업로드할 때 사용할 토큰 (hub_model_id있는 경우)

import { Form, Input, Select } from 'antd';

const ModelParams = () => {
  return (
    <>
      <Form.Item
        label="Train Model Name"
        name="train_model_name"
        rules={[{ required: true, message: 'Train Model Name is required' }]}
      >
        <Input placeholder="Enter Train Model Name" />
      </Form.Item>

      <Form.Item label="Model" name="model" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="stable-diffusion-2">Stable Diffusion 2</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="revision" name="revision">
        <Input placeholder="Enter Train Model version" />
      </Form.Item>

      <Form.Item label="variant" name="variant">
        <Input placeholder="Enter Train Model Name" />
      </Form.Item>

      <Form.Item label="tokenizer_name" name="tokenizer_name">
        <Input placeholder="Enter Train Model Name" />
      </Form.Item>

      <Form.Item label="hub_model_id" name="hub_model_id">
        <Input placeholder="Enter Train Model Name" />
      </Form.Item>

      <Form.Item label="push_to_hub: " name="push_to_hub: ">
        <Input placeholder="Enter Train Model Name" />
      </Form.Item>

      <Form.Item label="hub_token: " name="hub_token: ">
        <Input placeholder="Enter Train Model Name" />
      </Form.Item>
    </>
  );
};

export default ModelParams;
