// adam_beta1: Adam 옵티마이저의 Beta1 값
// adam_beta2: Adam 옵티마이저의 Beta2 값
// adam_weight_decay: 가중치 감쇠 값
// adam_epsilon: Adam 옵티마이저의 Epsilon 값
// max_grad_norm: 그래디언트 클리핑 최대 노름

import React from 'react';
import { InputNumber, Form } from 'antd';

const OptimizerParams = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Optimizer Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="Adam Beta 1">
          <InputNumber placeholder="Adam Beta 1" className="w-full" />
        </Form.Item>

        <Form.Item label="Adam Beta 2">
          <InputNumber placeholder="Adam Beta 2" className="w-full" />
        </Form.Item>

        <Form.Item label="Adam Weight Decay">
          <InputNumber placeholder="Weight Decay" className="w-full" />
        </Form.Item>

        <Form.Item label="Adam Epsilon">
          <InputNumber placeholder="Epsilon Value" className="w-full" />
        </Form.Item>

        <Form.Item label="Max Gradient Norm">
          <InputNumber placeholder="Max Gradient Norm" className="w-full" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(OptimizerParams);
