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
    (state: RootState) => state.training.params.checkpointParams
  );

  return (
    <>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Checkpoint Parameters</h3>
      <Form layout="horizontal">
        <Form.Item label="Checkpointing Steps">
          <Input
            type="number"
            value={checkpointingSteps === null ? '' : checkpointingSteps}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              if (value !== null && !isNaN(value)) {
                dispatch(setCheckpointingSteps(value));
              }
            }}
            placeholder="Enter checkpointing steps"
          />
        </Form.Item>

        <Form.Item label="Checkpoints Total Limit">
          <Input
            type="number"
            value={checkpointsTotalLimit === null ? '' : checkpointsTotalLimit}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              if (value !== null && !isNaN(value)) {
                dispatch(setCheckpointsTotalLimit(value));
              }
            }}
            placeholder="Enter total limit"
          />
        </Form.Item>

        <Form.Item label="Resume From Checkpoint">
          <Input
            placeholder="Enter resume from checkpoint"
            value={resumeFromCheckpoint}
            onChange={(e) => dispatch(setResumeFromCheckpoint(e.target.value))}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default CheckpointParams;
