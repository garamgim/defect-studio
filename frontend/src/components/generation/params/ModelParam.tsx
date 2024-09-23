// Txt2Img, Img2Img 에서 사용

import { Select, Form } from 'antd';
import React from 'react';

interface ModelParamProps {
  model: string;
  setModel: (model: string) => void;
}

const ModelParam = ({ model, setModel }: ModelParamProps) => {
  const handleChange = (value: string) => {
    setModel(value);
  };

  return (
    <div className="mt-[32px] px-6 pb-2">
      <p className="text-[14px] font-semibold mb-3 text-[#222] dark:text-gray-300">Model</p>
      <Form layout="vertical">
        <Form.Item>
          <Select
            value={model}
            onChange={handleChange}
            options={[
              {
                value: 'stable-diffusion-2',
                label: 'stable-diffusion-2'
              },
              {
                value: 'CompVis/stable-diffusion-v1-4',
                label: 'CompVis/stable-diffusion-v1-4'
              },
              { value: 'model3', label: 'model3' }
            ]}
            placeholder="Select a model"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(ModelParam);
