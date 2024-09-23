import { Select, Form } from 'antd';
import React from 'react';

interface InpaintingModelParamsProps {
  model: string;
  setModel: (model: string) => void;
}

const InpaintingModelParam = ({ model, setModel }: InpaintingModelParamsProps) => {
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
                value: 'diffusers/stable-diffusion-xl-1.0-inpainting-0.1',
                label: 'diffusers/stable-diffusion-xl-1.0-inpainting-0.1'
              },
              {
                value: 'stabilityai/stable-diffusion-2-inpainting',
                label: 'stabilityai/stable-diffusion-2-inpainting'
              },
              { value: 'stable-diffusion-2-inpainting', label: 'stable-diffusion-2-inpainting' }
            ]}
            placeholder="Select a model"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(InpaintingModelParam);
