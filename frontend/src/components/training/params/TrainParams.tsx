// *train_batch_size: 훈련 배치 크기
// *num_train_epochs: 에폭 수
// *learning_rate: 학습률
// max_train_steps: 최대 학습 스텝
// gradient_accumulation_steps: 그래디언트 누적 스텝 수
// scale_lr: 학습률 스케일링 여부
// lr_scheduler: 학습률 스케줄러
// lr_warmup_steps: 학습률 워밍업 스텝 수
// lr_num_cycles: 스케줄러 사이클 수
// lr_power: 다항식 스케줄러에서의 파워 팩터 (lr_scheduler가 "polynomial"일 때만)
// use_8bit_adam: 8비트 Adam 옵티마이저 사용 여부
// gradient_checkpointing: 그래디언트 체크포인팅 여부
// with_prior_preservation: 사전 보존 손실 적용 여부
// prior_loss_weight: 사전 보존 손실의 가중치
// seed: 재현성을 위한 시드 값
// train_text_encoder: 텍스트 인코더를 학습할지 여부

const TrainingParams = () => {
  return <div>trainingParams</div>;
};

export default TrainingParams;
