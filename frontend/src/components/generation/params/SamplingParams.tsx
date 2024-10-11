import { Form, Select, Slider, Row, Col, InputNumber, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getSchedulers } from '../../../api/generation';
import React, { useEffect } from 'react';
import { SamplingParamsType } from '../../../types/generation';

interface SamplingParamsProps {
  samplingParams: SamplingParamsType;
  updateSamplingParams: (scheduler: string, numInferenceSteps: number) => void;
}

const SamplingParams = ({ samplingParams, updateSamplingParams }: SamplingParamsProps) => {
  const {
    data: schedulerList,
    isLoading,
    error
  } = useQuery<string[], Error>({
    queryKey: ['schedulers'],
    queryFn: getSchedulers
  });

  // scheduler리스트 조회 api 오류 발생 시 알림 표시
  useEffect(() => {
    if (error) {
      message.error('Error loading schedulers. Please try again later.');
    }
  }, [error]);

  // 추후 로딩스피너로 변경
  if (isLoading) {
    return <div>로딩 중</div>;
  }

  const handleChange = (key: 'scheduler' | 'numInferenceSteps', value: number | string | null) => {
    if (value !== null) {
      const newScheduler = key === 'scheduler' ? String(value) : samplingParams.scheduler;
      const newNumInferenceSteps = key === 'numInferenceSteps' ? Number(value) : samplingParams.numInferenceSteps;
      updateSamplingParams(newScheduler, newNumInferenceSteps);
    }
  };

  return (
    <div className="p-6">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Sampling Settings</p>
      <Form layout="vertical" className="space-y-5">
        {/* Scheduler 설정 */}
        <Form.Item label="Scheduler">
          <Select
            value={samplingParams.scheduler}
            onChange={(value) => handleChange('scheduler', value)}
            options={schedulerList?.map((scheduler) => ({
              value: scheduler,
              label: scheduler
            }))}
          />
        </Form.Item>

        {/* Sampling Steps 설정 */}
        <Form.Item label="Sampling steps">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={1}
                max={150}
                value={samplingParams.numInferenceSteps}
                onChange={(value) => handleChange('numInferenceSteps', value)}
                tooltip={{ open: undefined }}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={1}
                max={150}
                value={samplingParams.numInferenceSteps}
                onChange={(value) => handleChange('numInferenceSteps', value)}
                className="w-full"
              />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(SamplingParams);
