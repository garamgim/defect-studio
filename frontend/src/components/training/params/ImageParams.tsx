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
import { Input, Checkbox, Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setInstancePrompt,
  setClassPrompt,
  setResolution,
  setCenterCrop,
  setSampleBatchSize,
  setInstanceImageList,
  setClassImageList,
  setValidationImages,
  setClassLabelsConditioning
} from '../../../store/slices/training/trainingSlice';

const ImageParams = () => {
  const dispatch = useDispatch();

  const {
    instancePrompt,
    classPrompt,
    resolution,
    centerCrop,
    sampleBatchSize,
    instanceImageList,
    classImageList,
    validationImages,
    classLabelsConditioning
  } = useSelector((state: RootState) => state.training);

  // 이미지 리스트를 Redux로 관리하는 핸들러
  const handleUpload = (actionCreator: (files: File[]) => void) => (fileList: any) => {
    const files = fileList.fileList.map((file: any) => file.originFileObj);
    dispatch(actionCreator(files));
    return false;
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Image Parameters</h3>
      <Form layout="vertical">
        {/* Instance Prompt */}
        <Form.Item label="Instance Prompt" required>
          <Input
            placeholder="Enter instance prompt"
            value={instancePrompt}
            onChange={(e) => dispatch(setInstancePrompt(e.target.value))}
          />
        </Form.Item>

        {/* Class Prompt */}
        <Form.Item label="Class Prompt" required>
          <Input
            placeholder="Enter class prompt"
            value={classPrompt}
            onChange={(e) => dispatch(setClassPrompt(e.target.value))}
          />
        </Form.Item>

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

        {/* Instance Image List */}
        <Form.Item label="Instance Image List" required>
          <Upload multiple listType="picture" beforeUpload={handleUpload(setInstanceImageList)}>
            <Button icon={<UploadOutlined />}>Upload Instance Images</Button>
          </Upload>
        </Form.Item>

        {/* Class Image List */}
        <Form.Item label="Class Image List" required>
          <Upload multiple listType="picture" beforeUpload={handleUpload(setClassImageList)}>
            <Button icon={<UploadOutlined />}>Upload Class Images</Button>
          </Upload>
        </Form.Item>

        {/* Validation Images */}
        <Form.Item label="Validation Images">
          <Upload multiple listType="picture" beforeUpload={handleUpload(setValidationImages)}>
            <Button icon={<UploadOutlined />}>Upload Validation Images</Button>
          </Upload>
        </Form.Item>

        {/* Class Labels Conditioning */}
        <Form.Item label="Class Labels Conditioning" valuePropName="checked">
          <Checkbox
            checked={classLabelsConditioning}
            onChange={(e) => dispatch(setClassLabelsConditioning(e.target.checked))}
          >
            Enable class labels conditioning
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ImageParams);
