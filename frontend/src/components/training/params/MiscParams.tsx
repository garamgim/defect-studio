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
const { TextArea } = Input;

const MiscParams = () => {
  return <div>miscellaneousParams</div>;
};

export default MiscParams;
