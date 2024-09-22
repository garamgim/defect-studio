// validation_prompt: 검증 프롬프트
// num_validation_images: 검증에 사용할 이미지 수
// validation_steps: 검증 간격
// validation_scheduler: 검증에 사용할 스케줄러 (Optional)

import React from 'react';
import { Input, InputNumber, Form } from 'antd';

const ValidationParams = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Validation Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="Validation Prompt">
          <Input placeholder="Validation Prompt" className="w-full" />
        </Form.Item>

        <Form.Item label="Number of Validation Images">
          <InputNumber placeholder="Number of Validation Images" className="w-full" />
        </Form.Item>

        <Form.Item label="Validation Steps">
          <InputNumber placeholder="Validation Steps" className="w-full" />
        </Form.Item>

        <Form.Item label="Validation Scheduler">
          <Input placeholder="Validation Scheduler" className="w-full" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ValidationParams);
