import { Select, Form } from 'antd';
import React from 'react';
import { getModelList } from '../../../api/generation';
import { useQuery } from '@tanstack/react-query';

interface ModelParamProps {
  model: string;
  setModel: (model: string) => void;
}

const ModelParam = ({ model, setModel }: ModelParamProps) => {
  const handleChange = (value: string) => {
    setModel(value);
  };

  const member_id = 1;

  const {
    data: modelList,
    isLoading,
    error
  } = useQuery({
    queryKey: ['models', member_id],
    queryFn: () => getModelList(member_id)
  });

  // 기본 모델 리스트
  const defaultModels = [
    { value: 'stable-diffusion-2', label: 'stable-diffusion-2' },
    { value: 'stable-diffusion-v1-5', label: 'stable-diffusion-v1-5' },
    { value: 'stable-diffusion-v1-4', label: 'stable-diffusion-v1-4' }
  ];

  // 기본 모델 리스트와 API로 받은 모델 리스트를 합침
  let combinedModelOptions = [
    ...defaultModels,
    ...(modelList?.map((model: string) => ({ value: model, label: model })) || [])
  ];

  // 이때는 default 모델 보여줌
  if (isLoading || error) {
    combinedModelOptions = defaultModels;
  }

  return (
    <div className="mt-[32px] px-6 pb-2">
      <p className="text-[14px] font-semibold mb-3 text-[#222] dark:text-gray-300">Model</p>
      <Form layout="vertical">
        <Form.Item>
          <Select value={model} onChange={handleChange} options={combinedModelOptions} placeholder="Select a model" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ModelParam);
