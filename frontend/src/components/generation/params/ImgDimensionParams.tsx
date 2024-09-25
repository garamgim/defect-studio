import { Slider, InputNumber, Row, Col, Form } from 'antd';
import React from 'react';
import { ImgDimensionParamsType } from '../../../types/generation';

interface ImgDimensionParamsProps {
  imgDimensionParams: ImgDimensionParamsType;
  updateImgDimensionParams: (width: number, height: number) => void;
}

const ImgDimensionParams = ({ imgDimensionParams, updateImgDimensionParams }: ImgDimensionParamsProps) => {
  const handleDimensionChange = (key: 'width' | 'height', value: number | null) => {
    if (value !== null) {
      const newWidth = key === 'width' ? value : imgDimensionParams.width;
      const newHeight = key === 'height' ? value : imgDimensionParams.height;
      updateImgDimensionParams(newWidth, newHeight);
    }
  };

  return (
    <div className="p-6">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Image Dimensions</p>
      <Form layout="vertical" className="space-y-4">
        {/* Width 설정 */}
        <Form.Item label="Width">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={1}
                max={2048}
                value={imgDimensionParams.width}
                onChange={(value) => handleDimensionChange('width', value)}
                tooltip={undefined}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={1}
                max={2048}
                value={imgDimensionParams.width}
                onChange={(value) => handleDimensionChange('width', value)}
                className="w-full"
              />
            </Col>
          </Row>
        </Form.Item>

        {/* Height 설정 */}
        <Form.Item label="Height">
          <Row gutter={16}>
            <Col span={16}>
              <Slider
                min={1}
                max={2048}
                value={imgDimensionParams.height}
                onChange={(value) => handleDimensionChange('height', value)}
                tooltip={undefined}
              />
            </Col>
            <Col span={8}>
              <InputNumber
                min={1}
                max={2048}
                value={imgDimensionParams.height}
                onChange={(value) => handleDimensionChange('height', value)}
                className="w-full"
              />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ImgDimensionParams);
