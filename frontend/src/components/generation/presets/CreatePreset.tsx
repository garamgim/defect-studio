import { Typography, Row, Col, Divider, Checkbox, Input, Modal, Button, message } from 'antd';
import { PresetDataType } from '../../../types/generation';
import React, { useState } from 'react';
import { postPreset } from '../../../api/generation';
import {
  ModelParamsType,
  BatchParamsType,
  ImgDimensionParamsType,
  GuidanceParamsType,
  SamplingParamsType,
  SeedParamsType,
  StrengthParamsType
} from '../../../types/generation';

const { Title, Text } = Typography;

interface CreatePresetProps {
  modelParams: ModelParamsType;
  batchParams: BatchParamsType;
  imgDimensionParams: ImgDimensionParamsType;
  guidanceParams: GuidanceParamsType;
  samplingParams: SamplingParamsType;
  seedParams: SeedParamsType;
  strengthParams?: StrengthParamsType;
  prompt: string;
  negativePrompt: string;
  type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'clean_up';
  isModalOpen: boolean;
  closeModal: () => void;
}

const CreatePreset = ({
  modelParams,
  batchParams,
  imgDimensionParams,
  guidanceParams,
  samplingParams,
  seedParams,
  prompt,
  negativePrompt,
  strengthParams,
  type,
  isModalOpen,
  closeModal
}: CreatePresetProps) => {
  const [presetTitle, setPresetTitle] = useState('');

  // 체크박스 상태 관리
  const [selectedFields, setSelectedFields] = useState({
    model: false,
    width: false,
    height: false,
    guidanceScale: false,
    numInferenceSteps: false,
    seed: false,
    prompt: false,
    negativePrompt: false,
    batchCount: false,
    batchSize: false,
    scheduler: false,
    strength: false
  });

  const handleCheckboxChange = (field: keyof typeof selectedFields) => {
    setSelectedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  // 프리셋 저장 함수
  const handleCreatePreset = async () => {
    try {
      const presetData: Partial<PresetDataType> = {
        preset_title: presetTitle,
        generation_type: type
      };

      // 선택된 필드만 데이터에 포함
      if (selectedFields.model) presetData.model = modelParams.model;
      if (selectedFields.prompt) presetData.prompt = prompt;
      if (selectedFields.negativePrompt) presetData.negative_prompt = negativePrompt;
      if (selectedFields.width) presetData.width = imgDimensionParams.width;
      if (selectedFields.height) presetData.height = imgDimensionParams.height;
      if (selectedFields.batchCount) presetData.batch_count = batchParams.batchCount;
      if (selectedFields.batchSize) presetData.batch_size = batchParams.batchSize;
      if (selectedFields.guidanceScale) presetData.guidance_scale = guidanceParams.guidanceScale;
      if (selectedFields.numInferenceSteps) presetData.sampling_steps = samplingParams.numInferenceSteps;
      if (selectedFields.scheduler) presetData.sampling_method = samplingParams.scheduler;
      if (selectedFields.seed) presetData.seed = seedParams.seed;
      if (strengthParams?.strength !== undefined && selectedFields.strength)
        presetData.strength = strengthParams?.strength;

      await postPreset(presetData as PresetDataType);
      message.success('Preset created successfully!');
      closeModal();
    } catch (error) {
      message.error('Failed to create preset');
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={closeModal}
      closable={false}
      footer={null}
      width={600}
      centered
      styles={{
        body: {
          maxHeight: '80vh',
          overflowY: 'auto'
        }
      }}
    >
      <div className="p-4">
        <Title level={4} className="dark:text-gray-300">
          Preset settings
        </Title>
        <Text type="secondary" className="dark:text-gray-400">
          The following settings will be saved in the preset. If you would like a setting to be editable, deselect them
          in the list below.
        </Text>

        <Input
          placeholder="Enter preset name"
          className="mt-8"
          value={presetTitle}
          onChange={(e) => setPresetTitle(e.target.value)}
        />

        <Divider />

        <Row gutter={[16, 16]} className="mt-4">
          {/* 왼쪽 열 */}
          <Col span={12}>
            <div>
              <Checkbox checked={selectedFields.model} onChange={() => handleCheckboxChange('model')}>
                <Text strong>Model</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {modelParams.model}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox checked={selectedFields.width} onChange={() => handleCheckboxChange('width')}>
                <Text strong>Width</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {imgDimensionParams.width}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox checked={selectedFields.height} onChange={() => handleCheckboxChange('height')}>
                <Text strong>Height</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {imgDimensionParams.height}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox checked={selectedFields.guidanceScale} onChange={() => handleCheckboxChange('guidanceScale')}>
                <Text strong>Guidance Scale</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {guidanceParams.guidanceScale}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox
                checked={selectedFields.numInferenceSteps}
                onChange={() => handleCheckboxChange('numInferenceSteps')}
              >
                <Text strong>Sampling Steps</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {samplingParams.numInferenceSteps}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox checked={selectedFields.seed} onChange={() => handleCheckboxChange('seed')}>
                <Text strong>Seed</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {seedParams.seed}
                </Text>
              </div>
            </div>
          </Col>

          {/* 오른쪽 열 */}
          <Col span={12}>
            <div>
              <Checkbox checked={selectedFields.prompt} onChange={() => handleCheckboxChange('prompt')}>
                <Text strong>Prompt</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {prompt}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox checked={selectedFields.negativePrompt} onChange={() => handleCheckboxChange('negativePrompt')}>
                <Text strong>Negative Prompt</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {negativePrompt}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox checked={selectedFields.batchCount} onChange={() => handleCheckboxChange('batchCount')}>
                <Text strong>Batch Count</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {batchParams.batchCount}
                </Text>
              </div>
            </div>
            <div className="mt-3">
              <Checkbox checked={selectedFields.batchSize} onChange={() => handleCheckboxChange('batchSize')}>
                <Text strong>Batch Size</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {batchParams.batchSize}
                </Text>
              </div>
            </div>
            {strengthParams?.strength !== undefined && (
              <div className="mt-3">
                <Checkbox checked={selectedFields.strength} onChange={() => handleCheckboxChange('strength')}>
                  <Text strong>Strength</Text>
                </Checkbox>
                <br />
                <div className="ml-[24px]">
                  <Text type="secondary" className="dark:text-gray-400">
                    {strengthParams.strength}
                  </Text>
                </div>
              </div>
            )}
            <div className="mt-3">
              <Checkbox checked={selectedFields.scheduler} onChange={() => handleCheckboxChange('scheduler')}>
                <Text strong>Scheduler</Text>
              </Checkbox>
              <br />
              <div className="ml-[24px]">
                <Text type="secondary" className="dark:text-gray-400">
                  {samplingParams.scheduler}
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="flex justify-end mt-4 gap-4">
        <Button onClick={closeModal}>Cancel</Button>
        <Button type="primary" onClick={handleCreatePreset}>
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default React.memo(CreatePreset);
