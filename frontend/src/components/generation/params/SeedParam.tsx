import { Form, InputNumber, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface SeedParamProps {
  seed: number;
  setSeed: (value: number) => void;
  isRandomSeed: boolean;
  handleRandomSeedChange: (event: CheckboxChangeEvent) => void;
}

const SeetParam = ({ seed, isRandomSeed, setSeed, handleRandomSeedChange }: SeedParamProps) => {
  return (
    <div className="px-6">
      {/* <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Seed</p> */}
      <Form layout="vertical" className="space-y-5">
        <Form.Item label="Seed">
          <InputNumber
            value={seed}
            onChange={(value) => {
              if (value !== null) {
                setSeed(value);
              }
            }}
            disabled={isRandomSeed}
            placeholder="Enter seed"
            className="w-full"
          />
          <Checkbox checked={isRandomSeed} onChange={handleRandomSeedChange} className="mt-2">
            Random
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SeetParam;
