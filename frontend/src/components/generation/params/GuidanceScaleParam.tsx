import { Form, Slider, Row, Col, InputNumber } from 'antd';
import React from 'react';
import { GuidanceParamsType } from '../../../types/generation';

interface GuidanceScaleParamsProps {
  guidanceParams: GuidanceParamsType;
  updateGuidanceParams: (guidanceScale: number) => void;
}

const ControlParams = ({ guidanceParams, updateGuidanceParams }: GuidanceScaleParamsProps) => {
  const handleGuidanceScaleChange = (guidanceScale: number | null) => {
    if (guidanceScale !== null) {
      updateGuidanceParams(guidanceScale);
    }
  };

  return (
    <div className="pt-6 px-6">
      <Form layout="vertical" className="space-y-5">
        {/* Guidance Scale 설정 */}
        <Form.Item label="Guidance scale">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={1.0}
                max={20.0}
                step={0.1}
                value={guidanceParams.guidanceScale}
                onChange={handleGuidanceScaleChange}
                tooltip={{ open: undefined }}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={1.0}
                max={20.0}
                step={0.1}
                value={guidanceParams.guidanceScale}
                onChange={handleGuidanceScaleChange}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ControlParams);
