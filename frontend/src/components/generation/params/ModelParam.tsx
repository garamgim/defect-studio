import { Select, Form, message } from 'antd';
import React, { useEffect } from 'react';
import { getModelList } from '../../../api/generation';
import { useQuery } from '@tanstack/react-query';
import { ModelParamsType } from '../../../types/generation';
import { useGetMyInfo } from '@/hooks/user/useGetMyInfo';

interface ModelParamProps {
  modelParams: ModelParamsType;
  updateModelParams: (model: string) => void;
}

const ModelParam = ({ modelParams, updateModelParams }: ModelParamProps) => {
  const { myInfo } = useGetMyInfo({ isLoggedIn: !!localStorage.getItem('accessToken') });
  const memberId = myInfo?.member_id as number;

  const handleChange = (model: string) => {
    updateModelParams(model);
  };

  const {
    data: modelList,
    isLoading,
    error
  } = useQuery<string[], Error>({
    queryKey: ['models', memberId],
    queryFn: () => getModelList(memberId)
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

  // 로딩 중이나 에러나면 default 모델 보여줌
  if (isLoading || error) {
    combinedModelOptions = defaultModels;
  }

  // model리스트 조회 api 오류 발생 시 알림 표시
  useEffect(() => {
    if (error) {
      message.error('Error loading models. Please try again later.');
    }
  }, [error]);

  return (
    <div className="mt-[32px] px-6 pb-2">
      <p className="text-[14px] font-semibold mb-3 text-[#222] dark:text-gray-300">Model</p>
      <Form layout="vertical">
        {/* Model 설정 */}
        <Form.Item>
          <Select
            value={modelParams.model}
            onChange={handleChange}
            options={combinedModelOptions}
            placeholder="Select a model"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ModelParam);
