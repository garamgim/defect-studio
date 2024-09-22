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

const ImageParams = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Image Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="Instance Prompt" required>
          <Input placeholder="Enter instance prompt" />
        </Form.Item>

        <Form.Item label="Class Prompt" required>
          <Input placeholder="Enter class prompt" />
        </Form.Item>

        <Form.Item label="Resolution">
          <Input type="number" placeholder="Enter resolution (e.g., 512)" />
        </Form.Item>

        <Form.Item label="Center Crop" valuePropName="checked">
          <Checkbox>Enable center crop</Checkbox>
        </Form.Item>

        <Form.Item label="Sample Batch Size">
          <Input type="number" placeholder="Enter sample batch size" />
        </Form.Item>

        <Form.Item label="Instance Image List" required>
          <Upload multiple listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Instance Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Class Image List" required>
          <Upload multiple listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Class Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Validation Images">
          <Upload multiple listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Validation Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Class Labels Conditioning" valuePropName="checked">
          <Checkbox>Enable class labels conditioning</Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ImageParams);
