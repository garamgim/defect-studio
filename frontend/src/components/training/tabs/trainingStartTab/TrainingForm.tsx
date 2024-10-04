import { Tabs } from 'antd';
import ModelParams from '../../params/ModelParams';
import ImageParams from '../../params/ImageParams';
import TrainParams from '../../params/TrainParams';
import OptimizerParams from '../../params/OptimizerParams';
import CheckpointParams from '../../params/CheckpointParams';
import styled from 'styled-components';
import TrainingButton from '../../TrainingButton';

const { TabPane } = Tabs;

const CustomTabs = styled(Tabs)`
  html.dark & .ant-tabs-content-holder {
    border-left: 1px solid #374151;
  }
  html.dark & .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #111827; // 활성화된 탭의 글씨 색상
  }
  html.dark & .ant-tabs-ink-bar {
    background-color: #1f2937; // 활성화된 탭 옆 선을 검정색으로 변경
  }
  .ant-tabs-tab .ant-tabs-tab-btn {
    font-size: 14px !important;
  }
`;

const TrainingForm = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      {/* Tabs Section */}
      <div className="flex-grow overflow-y-auto">
        <CustomTabs tabPosition="left" defaultActiveKey="1" className="h-full p-4">
          <TabPane tab="Model Parameters" key="1" className="pr-4 overflow-y-auto custom-scrollbar3">
            <ModelParams />
          </TabPane>
          <TabPane tab="Image Parameters" key="2" className="pr-4 overflow-y-auto custom-scrollbar3">
            <ImageParams />
          </TabPane>
          <TabPane tab="Training Parameters" key="3" className="pr-4 overflow-y-auto custom-scrollbar3">
            <TrainParams />
          </TabPane>
          <TabPane tab="Optimizer Parameters" key="4" className="pr-4 overflow-y-auto custom-scrollbar3">
            <OptimizerParams />
          </TabPane>
          <TabPane tab="Checkpoint Parameters" key="5" className="pr-4 overflow-y-auto custom-scrollbar3">
            <CheckpointParams />
          </TabPane>
        </CustomTabs>
      </div>

      {/* 훈련시작 버튼 */}
      <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-700">
        <TrainingButton />
      </div>
    </div>
  );
};

export default TrainingForm;
