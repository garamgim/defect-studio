// *instance_prompt: 인스턴스 프롬프트 (훈련할 특징)
// *class_prompt: 클래스 프롬프트 (훈련할 큰 범주)
// *resolution: 이미지 해상도
// center_crop: 중앙 자르기 여부
// sample_batch_size: 샘플 배치 크기
// *instance_image_list: 인스턴스 이미지 파일 목록
// *class_image_list: 클래스 이미지 파일 목록
// validation_images: 검증 이미지 세트
// class_labels_conditioning: 클래스 레이블 조건

import React from 'react';
import { Input, Checkbox, Form, Button, Collapse } from 'antd';
import { FiFolderPlus } from 'react-icons/fi';
import { MinusSquareOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setInstancePrompt,
  setClassPrompt,
  setInstanceImageFolder,
  setClassImageFolder,
  setValidationImageFolder,
  setResolution,
  setCenterCrop,
  setSampleBatchSize,
  setClassLabelsConditioning,
  addConcept,
  removeConcept
} from '../../../store/slices/training/trainingSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import styled from 'styled-components';

const { Panel } = Collapse;

const ImageParams = () => {
  const dispatch = useDispatch();
  const { concepts, resolution, centerCrop, sampleBatchSize, classLabelsConditioning, maxConcepts } = useSelector(
    (state: RootState) => state.training
  );

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

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Image Parameters</h3>

      {/* Resolution */}
      <Form.Item label="Resolution">
        <Input
          type="number"
          placeholder="Enter resolution (e.g., 512)"
          value={resolution}
          onChange={(e) => dispatch(setResolution(Number(e.target.value)))}
        />
      </Form.Item>

      {/* Center Crop */}
      <Form.Item label="Center Crop" valuePropName="checked">
        <Checkbox checked={centerCrop} onChange={(e) => dispatch(setCenterCrop(e.target.checked))}>
          Enable center crop
        </Checkbox>
      </Form.Item>

      {/* Sample Batch Size */}
      <Form.Item label="Sample Batch Size">
        <Input
          type="number"
          placeholder="Enter sample batch size"
          value={sampleBatchSize}
          onChange={(e) => dispatch(setSampleBatchSize(Number(e.target.value)))}
        />
      </Form.Item>

      {/* Class Labels Conditioning */}
      <Form.Item label="Class Labels Conditioning">
        <Input
          placeholder="Enter class labels conditioning"
          value={classLabelsConditioning}
          onChange={(e) => dispatch(setClassLabelsConditioning(e.target.value))}
        />
      </Form.Item>

      {/* Concept 아코디언 */}
      <Collapse accordion defaultActiveKey={['0']}>
        {concepts.map((concept, index) => (
          <Panel
            header={
              <div className="flex justify-between items-center">
                <span className="flex items-center">Concept {index + 1}</span>
                {concepts.length > 1 && (
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
              <Form.Item label="Class Prompt" required>
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
                    value={concept.instanceImageFolder || ''}
                    onChange={(e) => dispatch(setInstanceImageFolder({ index, folderPath: e.target.value }))}
                    type="text"
                    placeholder="Enter or select instance image folder"
                  />
                  <Button onClick={() => handleSelectFolder(index, setInstanceImageFolder)} className="px-[12px]">
                    <FiFolderPlus className="w-[18px] h-[18px]" />
                  </Button>
                </div>
              </Form.Item>

              {/* Class Image Folder */}
              <Form.Item label="Class Image Folder" required>
                <div className="flex items-center gap-2">
                  <Input
                    value={concept.classImageFolder || ''}
                    onChange={(e) => dispatch(setClassImageFolder({ index, folderPath: e.target.value }))}
                    type="text"
                    placeholder="Enter or select class image folder"
                  />
                  <Button onClick={() => handleSelectFolder(index, setClassImageFolder)} className="px-[12px]">
                    <FiFolderPlus className="w-[18px] h-[18px]" />
                  </Button>
                </div>
              </Form.Item>

              {/* Validation Image Folder */}
              <Form.Item label="Validation Image Folder">
                <div className="flex items-center gap-2">
                  <Input
                    value={concept.validationImageFolder || ''}
                    onChange={(e) => dispatch(setValidationImageFolder({ index, folderPath: e.target.value }))}
                    type="text"
                    placeholder="Enter or select validation image folder"
                  />
                  <Button onClick={() => handleSelectFolder(index, setValidationImageFolder)} className="px-[12px]">
                    <FiFolderPlus className="w-[18px] h-[18px]" />
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Panel>
        ))}
      </Collapse>

      {/* Concept 추가 버튼 */}
      {concepts.length < maxConcepts && (
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

export default React.memo(ImageParams);
