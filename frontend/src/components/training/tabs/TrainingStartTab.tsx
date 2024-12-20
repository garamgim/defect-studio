import { Row, Col } from 'antd';
import TrainingForm from './trainingStartTab/TrainingForm';
import TrainingStatusTab from './TrainingStatusTab';

const TrainingStartTab = () => {
  return (
    <Row gutter={24}>
      <Col xs={24} lg={18}>
        <div className="bg-white rounded-lg shadow-lg h-full border border-gray-300 overflow-hidden dark:bg-gray-600 dark:border-none">
          <TrainingForm />
        </div>
      </Col>

      {/* Training Progress only visible on larger screens */}
      <Col xs={0} lg={6}>
        <TrainingStatusTab />
      </Col>
    </Row>
  );
};

export default TrainingStartTab;
