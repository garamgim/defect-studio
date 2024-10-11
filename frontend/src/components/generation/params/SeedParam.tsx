import { Form, InputNumber, Checkbox } from 'antd';
import React from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { SeedParamsType } from '../../../types/generation';

interface SeedParamProps {
  seedParams: SeedParamsType;
  updateSeedParams: (seed: number, isRandomSeed: boolean) => void;
}

const SeedParam = ({ seedParams, updateSeedParams }: SeedParamProps) => {
  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    updateSeedParams(seedParams.seed, e.target.checked);
  };

  const onSeedChange = (value: number | null) => {
    if (value !== null) {
      updateSeedParams(value, seedParams.isRandomSeed);
    }
  };

  return (
    <div className="px-6">
      <Form layout="vertical" className="space-y-5">
        {/* seed 설정 */}
        <Form.Item label="Seed">
          <InputNumber
            value={seedParams.seed}
            onChange={onSeedChange}
            disabled={seedParams.isRandomSeed}
            placeholder="Enter seed"
            className="w-full"
          />
          <Checkbox checked={seedParams.isRandomSeed} onChange={onCheckboxChange} className="mt-2">
            Random
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(SeedParam);
