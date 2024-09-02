import { Dispatch, SetStateAction } from 'react';
import { Form, Select, Slider, Row, Col, InputNumber } from 'antd';

interface SamplingSettingsProps {
  samplingMethod: string;
  setSamplingMethod: Dispatch<SetStateAction<string>>;
  samplingSteps: number;
  setSamplingSteps: Dispatch<SetStateAction<number>>;
}

const SamplingSettings = ({
  samplingMethod,
  samplingSteps,
  setSamplingMethod,
  setSamplingSteps
}: SamplingSettingsProps) => {
  const handleSamplingStepsChange = (value: number | null) => {
    if (value !== null) {
      setSamplingSteps(value);
    }
  };

  return (
    <div className="p-6">
      <p className="text-[14px] font-semibold text-[#222] mb-3">Sampling Settings</p>
      <Form layout="vertical" className="space-y-5">
        <Form.Item label="Sampling method">
          <Select
            value={samplingMethod}
            onChange={setSamplingMethod}
            options={[
              { value: 'DPM++ 2M', label: 'DPM++ 2M' },
              { value: 'Euler a', label: 'Euler a' },
              { value: 'LMS', label: 'LMS' }
            ]}
            placeholder="Select a sampling method"
          />
        </Form.Item>

        <Form.Item label="Sampling steps">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={10}
                max={150}
                value={samplingSteps}
                onChange={(value) => setSamplingSteps(value as number)}
                tooltip={{ open: undefined }}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={10}
                max={150}
                value={samplingSteps}
                onChange={handleSamplingStepsChange}
                className="w-full"
              />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SamplingSettings;
