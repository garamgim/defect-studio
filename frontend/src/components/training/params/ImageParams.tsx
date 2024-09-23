// *instance_prompt: 인스턴스 프롬프트 (훈련할 특징)
// *class_prompt: 클래스 프롬프트 (훈련할 큰 범주)
// *resolution: 이미지 해상도
// center_crop: 중앙 자르기 여부
// sample_batch_size: 샘플 배치 크기
// *instance_image_list: 인스턴스 이미지 파일 목록
// *class_image_list: 클래스 이미지 파일 목록
// validation_images: 검증 이미지 세트
// class_labels_conditioning: 클래스 레이블 조건

import { Form, InputNumber, Input } from 'antd';

const { TextArea } = Input;

const ImgaeParams = () => {
  return (
    <>
      <Form.Item label="Instance Prompt" name="instance_prompt" rules={[{ required: true }]}>
        <TextArea rows={2} placeholder="Enter Instance Prompt" />
      </Form.Item>

      <Form.Item label="Class Prompt" name="class_prompt" rules={[{ required: true }]}>
        <TextArea rows={2} placeholder="Enter Class Prompt" />
      </Form.Item>

      <Form.Item label="*resolution" name="*resolution" rules={[{ required: true }]}>
        <InputNumber placeholder="Enter Class Prompt" />
      </Form.Item>

      {/* 체크박스 */}

      <Form.Item label="sample_batch_size" name="sample_batch_size" rules={[{ required: true }]}>
        <InputNumber placeholder="Enter Class Prompt" />
      </Form.Item>

      <Form.Item label="sample_batch_size" name="sample_batch_size" rules={[{ required: true }]}>
        <InputNumber placeholder="Enter Class Prompt" />
      </Form.Item>
      <Form.Item label="sample_batch_size" name="sample_batch_size" rules={[{ required: true }]}>
        <InputNumber placeholder="Enter Class Prompt" />
      </Form.Item>
      <Form.Item label="sample_batch_size" name="sample_batch_size" rules={[{ required: true }]}>
        <InputNumber placeholder="Enter Class Prompt" />
      </Form.Item>
    </>
  );
};

export default ImgaeParams;
