import { Form, InputNumber, Checkbox } from 'antd';
import React from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface SeedParamProps {
  seed: number;
  setSeed: (value: number) => void;
  isRandomSeed: boolean;
  handleRandomSeedChange: (checked: boolean) => void;
}

const SeedParam = ({ seed, isRandomSeed, setSeed, handleRandomSeedChange }: SeedParamProps) => {
  // Checkbox의 onChange 핸들러에서 checked 값을 추출하여 전달
  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    handleRandomSeedChange(e.target.checked); // checked 값만 전달
  };

  return (
    <div className="px-6">
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
          <Checkbox checked={isRandomSeed} onChange={onCheckboxChange} className="mt-2">
            Random
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(SeedParam);
