// dataloader_num_workers: 데이터 로딩에 사용할 워커 수
// allow_tf32: TF32 허용 여부
// logging_dir: 로그 저장 경로
// report_to: 로그 보고 플랫폼 (예: 'none', 'tensorboard')
// local_rank: 분산 학습을 위한 로컬 랭크
// enable_xformers_memory_efficient_attention: xformers 메모리 효율적 Attention 사용 여부
// set_grads_to_none: 그래디언트를 None으로 설정할지 여부
// offset_noise: 노이즈 조정 여부
// snr_gamma: SNR 가중치 감마
// pre_compute_text_embeddings: 텍스트 임베딩 미리 계산 여부
// tokenizer_max_length: 토크나이저 최대 길이
// text_encoder_use_attention_mask: 텍스트 인코더에 Attention Mask 사용 여부
// skip_save_text_encoder: 텍스트 인코더 저장 여부
// prior_generation_precision: 사전 생성 정밀도 (fp16, fp32, bf16)
// mixed_precision: 혼합 정밀도 설정 (fp16, bf16)

import React from 'react';
import { Input, Checkbox, Form, InputNumber } from 'antd';

const MiscParams = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Miscellaneous Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="DataLoader Number of Workers">
          <InputNumber placeholder="Number of Workers" className="w-full" />
        </Form.Item>

        <Form.Item label="Allow TF32" valuePropName="checked">
          <Checkbox>Enable TF32</Checkbox>
        </Form.Item>

        <Form.Item label="Logging Directory">
          <Input placeholder="Enter logging directory" />
        </Form.Item>

        <Form.Item label="Report To">
          <Input placeholder="Report To (e.g., TensorBoard)" />
        </Form.Item>

        <Form.Item label="Local Rank">
          <InputNumber placeholder="Enter Local Rank" className="w-full" />
        </Form.Item>

        <Form.Item label="Enable Xformers Memory Efficient Attention" valuePropName="checked">
          <Checkbox>Enable</Checkbox>
        </Form.Item>

        <Form.Item label="Set Gradients to None" valuePropName="checked">
          <Checkbox>Enable</Checkbox>
        </Form.Item>

        <Form.Item label="Offset Noise" valuePropName="checked">
          <Checkbox>Enable</Checkbox>
        </Form.Item>

        <Form.Item label="SNR Gamma">
          <InputNumber placeholder="Enter SNR Gamma" className="w-full" />
        </Form.Item>

        <Form.Item label="Precompute Text Embeddings" valuePropName="checked">
          <Checkbox>Enable</Checkbox>
        </Form.Item>

        <Form.Item label="Tokenizer Max Length">
          <InputNumber placeholder="Max Tokenizer Length" className="w-full" />
        </Form.Item>

        <Form.Item label="Text Encoder Attention Mask" valuePropName="checked">
          <Checkbox>Enable</Checkbox>
        </Form.Item>

        <Form.Item label="Skip Save Text Encoder" valuePropName="checked">
          <Checkbox>Enable</Checkbox>
        </Form.Item>

        <Form.Item label="Prior Generation Precision">
          <Input placeholder="Precision (e.g., fp16)" />
        </Form.Item>

        <Form.Item label="Mixed Precision">
          <Input placeholder="Mixed Precision (e.g., fp16)" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(MiscParams);
