import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { postTraining } from '../../../api/training';
import { RootState } from '../../../store/store';
import { TrainingParams } from '../../../types/training';
import { addTaskId } from '../../../store/slices/training/outputSlice';

const TrainingButton = () => {
  const dispatch = useDispatch();

  const { gpuNum, params } = useSelector((state: RootState) => state.training);

  // 폴더에서 파일을 가져오는 함수
  const getFilesFromFolder = async (folderPath: string): Promise<File[]> => {
    const fileDataArray = await window.electron.getFilesInFolder(folderPath);

    return fileDataArray.map((fileData) => {
      const byteString = atob(fileData.data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: fileData.type });
      return new File([blob], fileData.name, { type: fileData.type });
    });
  };

  // 빈 값이나 false, null, undefined는 데이터에서 제거
  const cleanObject = <T extends object>(obj: T): Partial<T> => {
    const cleanedObj = { ...obj };
    Object.keys(cleanedObj).forEach((key) => {
      if (
        cleanedObj[key as keyof T] === '' ||
        cleanedObj[key as keyof T] === false ||
        cleanedObj[key as keyof T] === null ||
        cleanedObj[key as keyof T] === undefined
      ) {
        delete cleanedObj[key as keyof T];
      }
    });
    return cleanedObj;
  };

  const handleTrainingStart = async () => {
    try {
      const instanceImageListFiles: File[] = [];
      const classImageListFiles: File[] = [];

      // 모든 concept에 대해 이미지 파일을 폴더에서 가져와서 배열에 추가
      const concepts = await Promise.all(
        params.conceptListParams.map(async (concept) => {
          const instanceFiles = await getFilesFromFolder(concept.instanceImageList);
          const classFiles = await getFilesFromFolder(concept.classImageList);

          instanceImageListFiles.push(...instanceFiles);
          classImageListFiles.push(...classFiles);

          return {
            instance_prompt: concept.instancePrompt,
            class_prompt: concept.classPrompt,
            instance_image_count: instanceFiles.length,
            class_image_count: classFiles.length
          };
        })
      );

      // 필수 필드와 선택적 필드 나누기
      const mandatoryFields: TrainingParams = {
        gpu_device: gpuNum !== null ? gpuNum : 1,
        pretrained_model_name_or_path: params.modelParams.pretrainedModelNameOrPath,
        train_model_name: params.modelParams.trainModelName,
        instance_image_list: instanceImageListFiles,
        class_image_list: classImageListFiles,
        concept_list: concepts,
        resolution: params.imgsParams.resolution,
        train_batch_size: params.trainingParams.trainBatchSize,
        num_train_epochs: params.trainingParams.numTrainEpochs,
        learning_rate: params.trainingParams.learningRate
      };

      // 선택적 필드들
      const optionalFields = {
        is_inpaint: params.modelParams.isInpaint,
        find_hugging_face: params.modelParams.findHuggingFace,
        tokenizer_name: params.modelParams.tokenizerName,
        revision: params.modelParams.revision,
        prior_loss_weight: params.imgsParams.priorLossWeight,
        center_crop: params.imgsParams.centerCrop,
        gradient_checkpointing: params.trainingParams.gradientCheckpointing,
        max_train_steps: params.trainingParams.maxTrainSteps,
        scale_lr: params.trainingParams.scaleLr,
        lr_scheduler: params.trainingParams.lrScheduler,
        lr_warmup_steps: params.trainingParams.lrWarmupSteps,
        lr_num_cycles: params.trainingParams.lrNumCycles,
        lr_power: params.trainingParams.lrPower,
        use_8bit_adam: params.trainingParams.use8bitAdam,
        seed: params.trainingParams.seed,
        train_text_encoder: params.trainingParams.trainTextEncoder,
        adam_beta1: params.optimizerParams.adamBeta1,
        adam_beta2: params.optimizerParams.adamBeta2,
        adam_weight_decay: params.optimizerParams.adamWeightDecay,
        adam_epsilon: params.optimizerParams.adamEpsilon,
        max_grad_norm: params.optimizerParams.maxGradNorm,
        checkpointing_steps: params.checkpointParams.checkpointingSteps,
        checkpoints_total_limit: params.checkpointParams.checkpointsTotalLimit,
        resume_from_checkpoint: params.checkpointParams.resumeFromCheckpoint
      };

      // 선택적 필드에서 빈 값 제거
      const cleanedOptionalFields = cleanObject(optionalFields);

      // 필수 필드와 선택적 필드 병합
      const fullTrainingData = {
        ...mandatoryFields,
        ...cleanedOptionalFields
      };

      const newTaskId = await postTraining('remote', fullTrainingData as TrainingParams);
      // 3초 후에 addTaskId 실행
      setTimeout(() => {
        dispatch(addTaskId(newTaskId));
      }, 3000);
    } catch (error) {
      message.error(`Error during training: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Button type="primary" onClick={handleTrainingStart}>
      Start Training
    </Button>
  );
};

export default TrainingButton;
