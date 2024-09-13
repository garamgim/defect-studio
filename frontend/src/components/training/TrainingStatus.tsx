import { Card, Progress, Row, Col } from 'antd';

interface TrainingStatusProps {
  isLoading: boolean;
  trainingTasks: { id: number; name: string; progress: number }[];
}

const TrainingStatus = ({ isLoading, trainingTasks }: TrainingStatusProps) => {
  return (
    <div className="training-status-container h-full overflow-y-auto p-4">
      <div className="flex flex-col">
        {isLoading ? (
          <p>Loading</p>
        ) : trainingTasks.length > 0 ? (
          <Row gutter={16}>
            {trainingTasks.map((task) => (
              <Col span={8} key={task.id}>
                <Card
                  title={task.name}
                  style={{ marginBottom: '16px', borderColor: '#D1D5DB' }}
                  styles={{
                    header: {
                      borderColor: '#D1D5DB'
                    }
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Progress type="circle" percent={task.progress} size={100} />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No ongoing training tasks.</p>
        )}
      </div>
    </div>
  );
};

export default TrainingStatus;
