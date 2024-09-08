import { Slider, InputNumber, Row, Col, Form } from 'antd';

interface ImageDimensionsProps {
  width: number;
  height: number;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
}

const ImageDimensions = ({ width, height, setWidth, setHeight }: ImageDimensionsProps) => {
  const handleWidthChange = (value: number | null) => {
    if (value !== null) setWidth(value);
  };

  const handleHeightChange = (value: number | null) => {
    if (value !== null) setHeight(value);
  };

  return (
    <div className="p-6">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Image Dimensions</p>
      <Form layout="vertical" className="space-y-4">
        <Form.Item label="Width">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={128}
                max={2048}
                value={width}
                onChange={(value) => setWidth(value)}
                tooltip={{ open: undefined }}
              />
            </Col>
            <Col span={8}>
              <InputNumber min={128} max={2048} value={width} onChange={handleWidthChange} className="w-full" />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Height">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={128}
                max={2048}
                value={height}
                onChange={(value) => setHeight(value)}
                tooltip={{ open: undefined }}
              />
            </Col>
            <Col span={8}>
              <InputNumber min={128} max={2048} value={height} onChange={handleHeightChange} className="w-full" />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ImageDimensions;
