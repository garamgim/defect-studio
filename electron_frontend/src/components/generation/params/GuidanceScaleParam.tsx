import { Form, Slider, Row, Col, InputNumber } from 'antd';

interface GuidanceScaleParamsProps {
  guidanceScale: number;
  setGuidanceScale: (value: number) => void;
}

const ControlParams = ({ guidanceScale, setGuidanceScale }: GuidanceScaleParamsProps) => {
  const handleGuidanceScaleChange = (value: number | null) => {
    if (value !== null) {
      setGuidanceScale(value);
    }
  };

  return (
    <div className="pt-6 px-6">
      {/* <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Guidance Scale</p> */}
      <Form layout="vertical" className="space-y-5">
        <Form.Item label="Guidance scale">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={1.0}
                max={30.0}
                step={0.1}
                value={guidanceScale}
                onChange={handleGuidanceScaleChange}
                tooltip={{ open: undefined }}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={1.0}
                max={30.0}
                step={0.1}
                value={guidanceScale}
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

export default ControlParams;
