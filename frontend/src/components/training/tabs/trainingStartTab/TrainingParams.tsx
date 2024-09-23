import { Tabs, ConfigProvider } from 'antd';
import ModelParams from '../../params/ModelParams';
import ImageParams from '../../params/ImageParams';
import TrainParams from '../../params/TrainParams';
import OptimizerParams from '../../params/OptimizerParams';
import CheckpointParams from '../../params/CheckpointParams';
import ValidationParams from '../../params/ValidationParams';
import MiscParams from '../../params/MiscParams';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

const { TabPane } = Tabs;

const TrainingParams = () => {
  // 모드 상태 관리: 'dark' 또는 'bright'
  const themeMode = useSelector((state: RootState) => state.theme);

  // 모드에 따른 테마 설정
  const theme = {
    components: {
      Tabs:
        themeMode.mode === 'dark'
          ? {
              // colorPrimary: '#a5b4fc', // Dark 모드에서의 강조 색상
              colorPrimaryActive: 'grey' // Dark 모드에서의 활성 탭 색상
            }
          : {
              colorPrimary: 'orange', // Bright 모드에서의 강조 색상
              colorPrimaryActive: 'red' // Bright 모드에서의 활성 탭 색상
            }
    }
  };

  // 모드에 따른 탭바 스타일 설정
  const tabBarStyle =
    themeMode.mode === 'dark'
      ? {
          // borderRight: '2px solid black' // Dark 모드 스타일
          // backgroundColor: '#1f1f1f',
          // color: '#fff'
        }
      : {
          borderRight: '2px solid gray' // Bright 모드 스타일
          // backgroundColor: '#fff',
          // color: '#000'
        };

  return (
    <ConfigProvider theme={theme}>
      <Tabs tabPosition="left" defaultActiveKey="1" className="h-full" tabBarStyle={tabBarStyle}>
        <TabPane tab="Model Parameters" key="1" className="pr-4 overflow-y-auto custom-scrollbar2">
          <ModelParams />
        </TabPane>
        <TabPane tab="Image Parameters" key="2" className="pr-4 overflow-y-auto custom-scrollbar2">
          <ImageParams />
        </TabPane>
        <TabPane tab="Training Parameters" key="3" className="pr-4 overflow-y-auto custom-scrollbar2">
          <TrainParams />
        </TabPane>
        <TabPane tab="Optimizer Parameters" key="4" className="pr-4 overflow-y-auto custom-scrollbar2">
          <OptimizerParams />
        </TabPane>
        <TabPane tab="Checkpoint Parameters" key="5" className="pr-4 overflow-y-auto custom-scrollbar2">
          <CheckpointParams />
        </TabPane>
        <TabPane tab="Validation Parameters" key="6" className="pr-4 overflow-y-auto custom-scrollbar2">
          <ValidationParams />
        </TabPane>
        <TabPane tab="Miscellaneous Parameters" key="7" className="pr-4 overflow-y-auto custom-scrollbar2">
          <MiscParams />
        </TabPane>
      </Tabs>
    </ConfigProvider>
  );
};

export default TrainingParams;
