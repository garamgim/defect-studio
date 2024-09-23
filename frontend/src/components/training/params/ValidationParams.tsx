// validation_prompt: 검증 프롬프트
// num_validation_images: 검증에 사용할 이미지 수
// validation_steps: 검증 간격
// validation_scheduler: 검증에 사용할 스케줄러 (Optional)

import React from 'react';
import { Input, InputNumber, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setValidationPrompt,
  setNumValidationImages,
  setValidationSteps,
  setValidationScheduler
} from '../../../store/slices/training/trainingSlice';

const ValidationParams = () => {
  const dispatch = useDispatch();

  // Redux 상태에서 필요한 값 가져오기
  const { validationPrompt, numValidationImages, validationSteps, validationScheduler } = useSelector(
    (state: RootState) => state.training
  );

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Validation Parameters</h3>
      <Form layout="vertical">
        {/* Validation Prompt */}
        <Form.Item label="Validation Prompt">
          <Input
            placeholder="Validation Prompt"
            className="w-full"
            value={validationPrompt}
            onChange={(e) => dispatch(setValidationPrompt(e.target.value))}
          />
        </Form.Item>

        {/* Number of Validation Images */}
        <Form.Item label="Number of Validation Images">
          <InputNumber
            placeholder="Number of Validation Images"
            className="w-full"
            value={numValidationImages}
            onChange={(value) => {
              if (value) {
                dispatch(setNumValidationImages(value));
              }
            }}
          />
        </Form.Item>

        {/* Validation Steps */}
        <Form.Item label="Validation Steps">
          <InputNumber
            placeholder="Validation Steps"
            className="w-full"
            value={validationSteps}
            onChange={(value) => {
              if (value) {
                dispatch(setValidationSteps(value));
              }
            }}
          />
        </Form.Item>

        {/* Validation Scheduler */}
        <Form.Item label="Validation Scheduler">
          <Input
            placeholder="Validation Scheduler"
            className="w-full"
            value={validationScheduler}
            onChange={(e) => dispatch(setValidationScheduler(e.target.value))}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ValidationParams);
