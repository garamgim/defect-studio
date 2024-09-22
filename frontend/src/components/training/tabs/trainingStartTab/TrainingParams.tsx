import { Tabs } from 'antd';
import ModelParams from '../../params/ModelParams';
import ImageParams from '../../params/ImageParams';
import TrainParams from '../../params/TrainParams';
import OptimizerParams from '../../params/OptimizerParams';
import CheckpointParams from '../../params/CheckpointParams';
import ValidationParams from '../../params/ValidationParams';
import MiscParams from '../../params/MiscParams';

const { TabPane } = Tabs;

const TrainingParams = () => {
  return (
    <Tabs tabPosition="left" defaultActiveKey="1">
      <TabPane tab="Model Parameters" key="1">
        <ModelParams />
      </TabPane>
      <TabPane tab="Image Parameters" key="2">
        <ImageParams />
      </TabPane>
      <TabPane tab="Training Parameters" key="3">
        <TrainParams />
      </TabPane>
      <TabPane tab="Optimizer Parameters" key="4">
        <OptimizerParams />
      </TabPane>
      <TabPane tab="Checkpoint Parameters" key="5">
        <CheckpointParams />
      </TabPane>
      <TabPane tab="Validation Parameters" key="6">
        <ValidationParams />
      </TabPane>
      <TabPane tab="Miscellaneous Parameters" key="7">
        <MiscParams />
      </TabPane>
    </Tabs>
  );
};

export default TrainingParams;
