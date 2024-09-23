// checkpointing_steps: 체크포인트 저장 간격
// checkpoints_total_limit: 체크포인트 저장 개수 제한
// resume_from_checkpoint: 체크포인트에서 훈련 재개 여부
import { Form, Input } from 'antd';
const { TextArea } = Input;

const CheckpointAndResumeParams = () => {
  return (
    <>
      <Form.Item label="revision" name="revision">
        <Input placeholder="Enter Train Model version" />
      </Form.Item>
    </>
  );
};

export default CheckpointAndResumeParams;
