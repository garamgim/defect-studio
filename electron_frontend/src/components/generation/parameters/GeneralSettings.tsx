import { Form, Input, Checkbox, Slider, Row, Col, InputNumber } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface GeneralSettingsProps {
  guidanceScale: number;
  setGuidanceScale: (value: number) => void;
  seed: string;
  setSeed: (value: string) => void;
  isRandomSeed: boolean;
  handleRandomSeedChange: (event: CheckboxChangeEvent) => void;
}

const GeneralSettings = ({
  guidanceScale,
  seed,
  isRandomSeed,
  setSeed,
  setGuidanceScale,
  handleRandomSeedChange
}: GeneralSettingsProps) => {
  const handleGuidanceScaleChange = (value: number | null) => {
    if (value !== null) {
      setGuidanceScale(value);
    }
  };

  return (
    <div className="p-6">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">General Settings</p>
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

        <Form.Item label="Seed">
          <Input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            disabled={isRandomSeed}
            placeholder="Enter seed"
          />
          <Checkbox checked={isRandomSeed} onChange={handleRandomSeedChange} className="mt-2">
            Random
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneralSettings;
