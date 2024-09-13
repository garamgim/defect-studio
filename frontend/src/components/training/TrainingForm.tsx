// import { useState } from 'react';
// import { Collapse, Form, Input, Select, Slider, InputNumber, Button, Upload, Checkbox } from 'antd';
// import { InboxOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

// const { TextArea } = Input;

const TrainingForm = () => {
  // const [concepts, setConcepts] = useState([{ key: 1 }]);

  // const addConcept = () => {
  //   if (concepts.length < 10) {
  //     setConcepts([...concepts, { key: concepts.length + 1 }]);
  //   }
  // };

  // const removeConcept = (key) => {
  //   if (concepts.length > 1) {
  //     setConcepts(concepts.filter(concept => concept.key !== key));
  //   }
  // };

  // const collapseItems = [
  //   {
  //     key: '1',
  //     label: '1. 학습 이미지 준비',
  //     children: (
  //       <Form layout="vertical">
  //         <Form.Item label="학습 대상 이름 (Identifier)">
  //           <Input placeholder="Enter the name of the character or object" />
  //         </Form.Item>

  //         <Form.Item label="학습 이미지 업로드 (5 to 100)">
  //           <Upload.Dragger 
  //             name="files" 
  //             multiple 
  //             accept=".png,.jpg,.jpeg,.webp,.heic" 
  //             beforeUpload={() => false}
  //             showUploadList={true} 
  //             maxCount={100}
  //           >
  //             <p className="ant-upload-drag-icon">
  //               <InboxOutlined />
  //             </p>
  //             <p className="ant-upload-text">Upload files or drag & drop</p>
  //             <p className="ant-upload-hint">
  //               PNG, JPG, WEBP and HEIC up to 15MB. Include a mix of full-body and background images.
  //             </p>
  //           </Upload.Dragger>
  //         </Form.Item>
  //       </Form>
  //     )
  //   },
  //   {
  //     key: '2',
  //     label: '2. 정규화 이미지 준비',
  //     children: (
  //       <Form layout="vertical">
  //         <Form.Item label="정규화 클래스">
  //           <Input placeholder="Enter the class for regularization (e.g., girl, boy)" />
  //         </Form.Item>

  //         <Form.Item label="정규화 이미지 업로드 (학습 이미지 x100)">
  //           <Upload.Dragger 
  //             name="files" 
  //             multiple 
  //             accept=".png,.jpg,.jpeg,.webp,.heic" 
  //             beforeUpload={() => false}
  //             showUploadList={true} 
  //             maxCount={1000}
  //           >
  //             <p className="ant-upload-drag-icon">
  //               <InboxOutlined />
  //             </p>
  //             <p className="ant-upload-text">Upload regularization images or drag & drop</p>
  //             <p className="ant-upload-hint">
  //               Ensure images match the general characteristics of the target (e.g., generic girl images for a girl character).
  //             </p>
  //           </Upload.Dragger>
  //         </Form.Item>
  //       </Form>
  //     )
  //   },
  //   {
  //     key: '3',
  //     label: '3. 학습 설정 및 모델 생성',
  //     children: (
  //       <Form layout="vertical">
  //         <Form.Item label="Pretrained Model Path">
  //           <Input placeholder="Path to the pretrained model" />
  //         </Form.Item>

  //         <Form.Item label="Output Directory">
  //           <Input placeholder="Directory to save the trained model" />
  //         </Form.Item>

  //         <Form.Item label="Image Resolution">
  //           <Select
  //             options={[
  //               { value: '512', label: '512' },
  //               { value: '768', label: '768' }
  //             ]}
  //             placeholder="Select Image Resolution"
  //           />
  //         </Form.Item>

  //         <Form.Item label="Training Steps">
  //           <InputNumber min={100} placeholder="Enter the number of training steps (e.g., 2000)" />
  //         </Form.Item>

  //         <Form.Item label="Learning Rate">
  //           <Select
  //             options={[
  //               { value: '1e-4', label: '1e-4' },
  //               { value: '1e-5', label: '1e-5' },
  //               { value: '1e-6', label: '1e-6' }
  //             ]}
  //             placeholder="Select Learning Rate"
  //           />
  //         </Form.Item>

  //         <Form.Item label="VRAM 최적화 설정">
  //           <Checkbox.Group>
  //             <Checkbox value="use_8bit_adam">Use 8-bit Adam</Checkbox>
  //             <Checkbox value="xformers">Use Xformers</Checkbox>
  //             <Checkbox value="mixed_precision">Use Mixed Precision (FP16)</Checkbox>
  //             <Checkbox value="cache_latents">Cache Latents</Checkbox>
  //             <Checkbox value="gradient_checkpointing">Enable Gradient Checkpointing</Checkbox>
  //           </Checkbox.Group>
  //         </Form.Item>

  //         <Form.Item label="Clip Skip 설정">
  //           <InputNumber min={1} max={12} defaultValue={2} />
  //         </Form.Item>

  //         <Form.Item label="Additional Settings">
  //           <TextArea rows={4} placeholder="Add any additional command line arguments or settings" />
  //         </Form.Item>

  //         <Form.Item>
  //           <Button type="primary">Start Training</Button>
  //         </Form.Item>
  //       </Form>
  //     )
  //   }
  // ];

  return (
    <div className="training-form-container h-full overflow-y-auto">
      {/* <Collapse defaultActiveKey={['1']} items={collapseItems} />
      <Button type="dashed" icon={<PlusOutlined />} onClick={addConcept} style={{ width: '100%', marginTop: 16 }}>
        Add Concept
      </Button> */}
    </div>
  );
};

export default TrainingForm;
