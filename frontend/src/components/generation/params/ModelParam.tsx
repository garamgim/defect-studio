import { Select, Form } from 'antd';

interface ModelParamProps {
  model: string;
  setModel: (model: string) => void;
}

const ModelParam = ({ model, setModel }: ModelParamProps) => {
  const handleChange = (value: string) => {
    setModel(value);
  };

  return (
    <div className="px-6 pt-6 pb-2">
      <p className="text-[14px] font-semibold mb-3 text-[#222] dark:text-gray-300">Model</p>
      <Form layout="vertical">
        <Form.Item>
          <Select
            value={model}
            onChange={handleChange}
            options={[
              {
                value: 'CompVis/stable-diffusion-v1-4',
                label: 'CompVis/stable-diffusion-v1-4'
              },
              {
                value: 'model2',
                label: 'model2'
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

export default ModelParam;
