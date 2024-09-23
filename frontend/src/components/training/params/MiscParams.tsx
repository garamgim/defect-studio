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
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setDataloaderNumWorkers,
  setAllowTf32,
  setLoggingDir,
  setReportTo,
  setLocalRank,
  setEnableXformersMemoryEfficientAttention,
  setSetGradsToNone,
  setOffsetNoise,
  setSnrGamma,
  setPreComputeTextEmbeddings,
  setTokenizerMaxLength,
  setTextEncoderUseAttentionMask,
  setSkipSaveTextEncoder,
  setPriorGenerationPrecision,
  setMixedPrecision
} from '../../../store/slices/training/trainingSlice';

const MiscParams = () => {
  const dispatch = useDispatch();

  const {
    dataloaderNumWorkers,
    allowTf32,
    loggingDir,
    reportTo,
    localRank,
    enableXformersMemoryEfficientAttention,
    setGradsToNone,
    offsetNoise,
    snrGamma,
    preComputeTextEmbeddings,
    tokenizerMaxLength,
    textEncoderUseAttentionMask,
    skipSaveTextEncoder,
    priorGenerationPrecision,
    mixedPrecision
  } = useSelector((state: RootState) => state.training);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Miscellaneous Parameters</h3>
      <Form layout="vertical">
        <Form.Item label="DataLoader Number of Workers">
          <InputNumber
            placeholder="Number of Workers"
            className="w-full"
            value={dataloaderNumWorkers}
            onChange={(value) => {
              if (value) {
                dispatch(setDataloaderNumWorkers(value));
              }
            }}
          />
        </Form.Item>

        <Form.Item label="Allow TF32" valuePropName="checked">
          <Checkbox checked={allowTf32} onChange={(e) => dispatch(setAllowTf32(e.target.checked))}>
            Enable TF32
          </Checkbox>
        </Form.Item>

        <Form.Item label="Logging Directory">
          <Input
            placeholder="Enter logging directory"
            value={loggingDir}
            onChange={(e) => dispatch(setLoggingDir(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Report To">
          <Input
            placeholder="Report To (e.g., TensorBoard)"
            value={reportTo}
            onChange={(e) => dispatch(setReportTo(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Local Rank">
          <InputNumber
            placeholder="Enter Local Rank"
            className="w-full"
            value={localRank}
            onChange={(value) => {
              if (value) {
                setLocalRank(value);
              }
            }}
          />
        </Form.Item>

        <Form.Item label="Enable Xformers Memory Efficient Attention" valuePropName="checked">
          <Checkbox
            checked={enableXformersMemoryEfficientAttention}
            onChange={(e) => dispatch(setEnableXformersMemoryEfficientAttention(e.target.checked))}
          >
            Enable
          </Checkbox>
        </Form.Item>

        <Form.Item label="Set Gradients to None" valuePropName="checked">
          <Checkbox checked={setGradsToNone} onChange={(e) => dispatch(setSetGradsToNone(e.target.checked))}>
            Enable
          </Checkbox>
        </Form.Item>

        <Form.Item label="Offset Noise" valuePropName="checked">
          <Checkbox checked={offsetNoise} onChange={(e) => dispatch(setOffsetNoise(e.target.checked))}>
            Enable
          </Checkbox>
        </Form.Item>

        <Form.Item label="SNR Gamma">
          <InputNumber
            placeholder="Enter SNR Gamma"
            className="w-full"
            value={snrGamma}
            onChange={(value) => {
              if (value) {
                dispatch(setSnrGamma(value));
              }
            }}
          />
        </Form.Item>

        <Form.Item label="Precompute Text Embeddings" valuePropName="checked">
          <Checkbox
            checked={preComputeTextEmbeddings}
            onChange={(e) => dispatch(setPreComputeTextEmbeddings(e.target.checked))}
          >
            Enable
          </Checkbox>
        </Form.Item>

        <Form.Item label="Tokenizer Max Length">
          <InputNumber
            placeholder="Max Tokenizer Length"
            className="w-full"
            value={tokenizerMaxLength}
            onChange={(value) => {
              if (value) {
                setTokenizerMaxLength(value);
              }
            }}
          />
        </Form.Item>

        <Form.Item label="Text Encoder Attention Mask" valuePropName="checked">
          <Checkbox
            checked={textEncoderUseAttentionMask}
            onChange={(e) => dispatch(setTextEncoderUseAttentionMask(e.target.checked))}
          >
            Enable
          </Checkbox>
        </Form.Item>

        <Form.Item label="Skip Save Text Encoder" valuePropName="checked">
          <Checkbox checked={skipSaveTextEncoder} onChange={(e) => dispatch(setSkipSaveTextEncoder(e.target.checked))}>
            Enable
          </Checkbox>
        </Form.Item>

        <Form.Item label="Prior Generation Precision">
          <Input
            placeholder="Precision (e.g., fp16)"
            value={priorGenerationPrecision}
            onChange={(e) => dispatch(setPriorGenerationPrecision(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Mixed Precision">
          <Input
            placeholder="Mixed Precision (e.g., fp16)"
            value={mixedPrecision}
            onChange={(e) => dispatch(setMixedPrecision(e.target.value))}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default React.memo(MiscParams);
