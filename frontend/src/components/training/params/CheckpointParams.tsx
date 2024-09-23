// checkpointing_steps: 체크포인트 저장 간격
// checkpoints_total_limit: 체크포인트 저장 개수 제한
// resume_from_checkpoint: 체크포인트에서 훈련 재개 여부

import React from 'react';
import { Input, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setCheckpointingSteps,
  setCheckpointsTotalLimit,
  setResumeFromCheckpoint
} from '../../../store/slices/training/trainingSlice';

const CheckpointParams = () => {
  const dispatch = useDispatch();

  const { checkpointingSteps, checkpointsTotalLimit, resumeFromCheckpoint } = useSelector(
    (state: RootState) => state.training
  );

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Checkpoint Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="Checkpointing Steps">
          <Input
            type="number"
            value={checkpointingSteps}
            onChange={(e) => dispatch(setCheckpointingSteps(Number(e.target.value)))}
            placeholder="Enter checkpointing steps"
          />
        </Form.Item>

        <Form.Item label="Checkpoints Total Limit">
          <Input
            type="number"
            value={checkpointsTotalLimit}
            onChange={(e) => dispatch(setCheckpointsTotalLimit(Number(e.target.value)))}
            placeholder="Enter total limit"
          />
        </Form.Item>

        <Form.Item label="Resume From Checkpoint">
          <Input
            placeholder="Hub Token"
            value={resumeFromCheckpoint}
            onChange={(e) => dispatch(setResumeFromCheckpoint(e.target.value))}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(CheckpointParams);
