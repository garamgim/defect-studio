// checkpointing_steps: 체크포인트 저장 간격
// checkpoints_total_limit: 체크포인트 저장 개수 제한
// resume_from_checkpoint: 체크포인트에서 훈련 재개 여부

import React from 'react';
import { Input, Checkbox, Form } from 'antd';

const CheckpointParams = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Checkpoint Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="Checkpointing Steps">
          <Input type="number" placeholder="Enter checkpointing steps" />
        </Form.Item>

        <Form.Item label="Checkpoints Total Limit">
          <Input type="number" placeholder="Enter total limit" />
        </Form.Item>

        <Form.Item label="Resume From Checkpoint" valuePropName="checked">
          <Checkbox>Resume from checkpoint</Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(CheckpointParams);
