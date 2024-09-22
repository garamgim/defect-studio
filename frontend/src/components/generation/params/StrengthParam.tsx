import { Form, Slider, Row, Col, InputNumber } from 'antd';
import React from 'react';

interface StrengthParamsProps {
  strength: number;
  setStrength: (value: number) => void;
}

const StrengthParam = ({ strength, setStrength }: StrengthParamsProps) => {
  const handleStrengthChange = (value: number | null) => {
    if (value !== null) {
      setStrength(value);
    }
  };

  return (
    <div className="px-6">
      {/* <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Denoising Strength</p> */}
      <Form layout="vertical" className="space-y-5">
        <Form.Item label="Denoising Strength">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={0.0}
                max={1.0}
                step={0.01}
                value={strength}
                onChange={handleStrengthChange}
                tooltip={{ open: undefined }}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={0.0}
                max={1.0}
                step={0.01}
                value={strength}
                onChange={handleStrengthChange}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(StrengthParam);
