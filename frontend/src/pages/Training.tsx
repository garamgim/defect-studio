import { useState } from 'react';
import { Tabs } from 'antd';
import TrainingStartTab from '../components/training/tabs/TrainingStartTab';
import TrainingStatusTab from '../components/training/tabs/TrainingStatusTab';

const { TabPane } = Tabs;

const Training = () => {
  // 진행상황 dummyData
  const [trainProgress] = useState([
    { name: 'model1', progress: 45 },
    { name: 'model2', progress: 75 }
  ]);

  const handleStopTraining = (modelName: string) => {
    console.log(`${modelName} training stopped.`);
  };

  return (
    <div className="w-full h-[calc(100vh-60px)] bg-gray-100 px-8 pt-4 pb-8 dark:bg-gray-800">
      <Tabs defaultActiveKey="1" className="h-full">
        {/* 모델 훈련 */}
        <TabPane tab="Model Training" key="1" className="h-full">
          <div className="h-full">
            <TrainingStartTab trainProgress={trainProgress} handleStopTraining={handleStopTraining} />
          </div>
        </TabPane>

        {/* 모델 훈련 진행상황 */}
        <TabPane tab="Training Status" key="2" className="h-full">
          <div className="h-full">
            <TrainingStatusTab trainProgress={trainProgress} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Training;
