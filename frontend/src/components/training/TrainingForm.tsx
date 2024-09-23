import { Form, Button, Collapse } from 'antd';
import ModelParams from './params/ModelParams';
import ImageParams from './params/ImageParams';
import TrainParams from './params/TrainParams';
import OptimizerParams from './params/OptimizerParams';
import CheckpointParams from './params/CheckpointParams';
import ValidationParams from './params/ValidationParams';
import MiscParams from './params/MiscParams';
import { TrainingState } from '../../store/slices/training/trainingSlice';

const { Panel } = Collapse;

const TrainingForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: TrainingState) => {
    console.log('Form Values:', values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Collapse defaultActiveKey={['1']}>
        {/* 모델 관련 설정 */}
        <Panel header="Model Settings" key="1">
          <ModelParams />
        </Panel>

        {/* 훈련 하이퍼파라미터 */}
        <Panel header="Training Hyperparameters" key="2">
          <ImageParams />
        </Panel>

        {/* 데이터 및 이미지 설정 */}
        <Panel header="Data and Image Settings" key="3">
          <TrainParams />
        </Panel>

        {/* 체크포인트 및 재시작 설정 */}
        <Panel header="Checkpoint and Resume Settings" key="4">
          <OptimizerParams />
        </Panel>

        {/* 검증 관련 설정 */}
        <Panel header="Validation Settings" key="5">
          <CheckpointParams />
        </Panel>

        {/* 최적화 관련 설정 */}
        <Panel header="Optimizer Settings" key="6">
          <ValidationParams />
        </Panel>

        {/* 기타 설정 */}
        <Panel header="Miscellaneous Settings" key="6">
          <MiscParams />
        </Panel>
      </Collapse>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Start Training
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TrainingForm;
