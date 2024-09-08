import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setWidth,
  setHeight,
  setGuidanceScale,
  setSamplingSteps,
  setSeed,
  setIsRandomSeed,
  setModel,
  setSamplingMethod,
  setBatchCount,
  setBatchSize
} from '../../../store/slices/generation/txtToImgSlice';
import Model from '../parameters/Model';
import ImageDimensions from '../parameters/ImageDimensions';
import GeneralSettings from '../parameters/GeneralSettings';
import SamplingSettings from '../parameters/SamplingSettings';
import BatchSettings from '../parameters/BatchSettings';

const Sidebar = () => {
  const dispatch = useDispatch();
  const {
    width,
    height,
    guidanceScale,
    samplingSteps,
    seed,
    isRandomSeed,
    model,
    samplingMethod,
    batchCount,
    batchSize
  } = useSelector((state: RootState) => state.txtToImg); // txtToImg 상태 가져오기
  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  const handleRandomSeedChange = () => {
    dispatch(setIsRandomSeed(!isRandomSeed));
    dispatch(setSeed(!isRandomSeed ? '-1' : ''));
  };

  return (
    <div className="w-full lg:w-72 h-full fixed-height mr-6">
      <div className="w-full lg:w-72 h-full overflow-y-auto custom-scrollbar rounded-[15px] bg-white shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
        {/* 모델 */}
        <Model model={model} setModel={(value: string) => dispatch(setModel(value))} />

        {level === 'Advanced' && (
          <>
            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 이미지 크기 */}
            <ImageDimensions
              width={width}
              height={height}
              setWidth={(value: number) => dispatch(setWidth(value))}
              setHeight={(value: number) => dispatch(setHeight(value))}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 샘플링 세팅 */}
            <SamplingSettings
              samplingMethod={samplingMethod}
              samplingSteps={samplingSteps}
              setSamplingSteps={(value: number) => dispatch(setSamplingSteps(value))}
              setSamplingMethod={(value: string) => dispatch(setSamplingMethod(value))}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 일반 세팅 */}
            <GeneralSettings
              guidanceScale={guidanceScale}
              setGuidanceScale={(value: number) => dispatch(setGuidanceScale(value))}
              seed={seed}
              setSeed={(value: string) => dispatch(setSeed(value))}
              isRandomSeed={isRandomSeed}
              handleRandomSeedChange={handleRandomSeedChange}
            />

            <hr className="border-t-[2px] border-[#E6E6E6] w-full dark:border-gray-800" />

            {/* 배치 세팅 */}
            <BatchSettings
              batchCount={batchCount}
              batchSize={batchSize}
              setBatchCount={(value: string) => dispatch(setBatchCount(value))}
              setBatchSize={(value: string) => dispatch(setBatchSize(value))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
