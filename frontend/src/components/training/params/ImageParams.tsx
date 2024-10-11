import { Input, Checkbox, Form, Button, Collapse } from 'antd';
import { FiFolderPlus } from 'react-icons/fi';
import { MinusSquareOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setResolution,
  setPriorLossWeight,
  setCenterCrop,
  addConcept,
  removeConcept,
  setClassPrompt,
  setInstanceImageList,
  setClassImageList,
  setInstancePrompt
} from '../../../store/slices/training/trainingSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import styled from 'styled-components';

const { Panel } = Collapse;

const CustomMinusSquareOutlined = styled(MinusSquareOutlined)`
  color: black;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }

  /* 다크 모드에서는 흰색 → 빨간색으로 변경 */
  html.dark & {
    color: white;

    &:hover {
      color: red;
    }
  }
`;

const ImageParams = () => {
  const dispatch = useDispatch();
  const { resolution, priorLossWeight, centerCrop } = useSelector(
    (state: RootState) => state.training.params.imgsParams
  );
  const conceptListParams = useSelector((state: RootState) => state.training.params.conceptListParams);
  const maxConcepts = useSelector((state: RootState) => state.training.maxConcepts);

  // 폴더 선택 핸들러
  const handleSelectFolder = async (
    index: number,
    actionCreator: (payload: {
      index: number;
      folderPath: string;
    }) => PayloadAction<{ index: number; folderPath: string }>
  ) => {
    try {
      const selectedFolderPath = await window.electron.selectFolder();
      if (selectedFolderPath) {
        dispatch(actionCreator({ index, folderPath: selectedFolderPath }));
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Image Parameters</h3>

      {/* resolution */}
      <Form.Item label="Resolution" required>
        <Input
          type="number"
          placeholder="Enter resolution"
          value={resolution}
          onChange={(e) => dispatch(setResolution(Number(e.target.value)))}
        />
      </Form.Item>

      {/* priorLossWeight */}
      <Form.Item label="Prior Loss Weight">
        <Input
          type="number"
          placeholder="Enter prior loss weight"
          value={priorLossWeight}
          onChange={(e) => dispatch(setPriorLossWeight(Number(e.target.value)))}
          disabled={!conceptListParams.some((concept) => concept.classPrompt)}
        />
      </Form.Item>

      {/* Center Crop */}
      <Form.Item label="Center Crop" valuePropName="checked">
        <Checkbox checked={centerCrop} onChange={(e) => dispatch(setCenterCrop(e.target.checked))}></Checkbox>
      </Form.Item>

      {/* Concept 아코디언 */}
      <Collapse className="dark:bg-gray-500 dark:border-none" accordion defaultActiveKey={['0']}>
        {conceptListParams.map((concept, index) => (
          <Panel
            header={
              <div className="flex justify-between items-center dark:text-gray-300">
                <span className="flex items-center">Concept {index + 1}</span>
                {conceptListParams.length > 1 && (
                  <CustomMinusSquareOutlined
                    onClick={(e) => {
                      e.stopPropagation(); // 패널 확장/축소 방지
                      dispatch(removeConcept(index));
                    }}
                  />
                )}
              </div>
            }
            key={index}
          >
            <Form layout="vertical">
              {/* Instance Prompt */}
              <Form.Item label="Instance Prompt" required>
                <Input
                  placeholder="Enter instance prompt"
                  value={concept.instancePrompt}
                  onChange={(e) => dispatch(setInstancePrompt({ index, prompt: e.target.value }))}
                />
              </Form.Item>

              {/* Class Prompt */}
              <Form.Item label="Class Prompt">
                <Input
                  placeholder="Enter class prompt"
                  value={concept.classPrompt}
                  onChange={(e) => dispatch(setClassPrompt({ index, prompt: e.target.value }))}
                />
              </Form.Item>

              {/* Instance Image Folder */}
              <Form.Item label="Instance Image Folder" required>
                <div className="flex items-center gap-2">
                  <Input
                    value={concept.instanceImageList || ''}
                    onChange={(e) => dispatch(setInstanceImageList({ index, folderPath: e.target.value }))}
                    type="text"
                    placeholder="Enter or select instance image folder"
                  />
                  <Button onClick={() => handleSelectFolder(index, setInstanceImageList)} className="px-[12px]">
                    <FiFolderPlus className="w-[18px] h-[18px]" />
                  </Button>
                </div>
              </Form.Item>

              {/* Class Image Folder */}
              <Form.Item label="Class Image Folder">
                <div className="flex items-center gap-2">
                  <Input
                    value={concept.classImageList || ''}
                    onChange={(e) => dispatch(setClassImageList({ index, folderPath: e.target.value }))}
                    type="text"
                    placeholder="Enter or select class image folder"
                  />
                  <Button onClick={() => handleSelectFolder(index, setClassImageList)} className="px-[12px]">
                    <FiFolderPlus className="w-[18px] h-[18px]" />
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Panel>
        ))}
      </Collapse>

      {/* Concept 추가 버튼 */}
      {conceptListParams.length < maxConcepts && (
        <Button
          onClick={() => dispatch(addConcept())}
          type="default"
          className="mt-4"
          style={{
            color: '#1890ff',
            border: '1px solid #1890ff',
            backgroundColor: 'white',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#60a5fa';
            e.currentTarget.style.border = '1px solid #60a5fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#1890ff';
            e.currentTarget.style.border = '1px solid #1890ff';
          }}
        >
          Add Concept
        </Button>
      )}
    </div>
  );
};

export default ImageParams;
