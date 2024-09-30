import { Button } from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { postTraining } from '../../api/training';
import { RootState } from '../../store/store';
import snakecaseKeys from 'snakecase-keys';

const TrainingButton = () => {
  const [loading, setLoading] = useState(false);

  const trainingParamsData = useSelector((state: RootState) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { maxConcepts, concepts, ...rest } = state.training;
    return rest;
  });

  const concepts = useSelector((state: RootState) => state.training.concepts);

  const getFilesFromFolder = async (folderPath: string) => {
    const fileDataArray = await window.electron.getFilesInFolder(folderPath);

    const files = fileDataArray.map((fileData) => {
      const byteString = atob(fileData.data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], { type: fileData.type });
      return new File([blob], fileData.name, { type: fileData.type });
    });
    return files;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanObject = (obj: any) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj[key] === '' || obj[key] === false || obj[key] === -1) {
          delete obj[key];
        }
      }
    }
    return obj;
  };

  const handleTrainingStart = async () => {
    setLoading(true);

    try {
      const firstConcept = concepts[0];

      const { instancePrompt, classPrompt, instanceImageFolder, classImageFolder } = firstConcept;

      const instanceImageFiles = await getFilesFromFolder(instanceImageFolder);
      const classImageListFiles = await getFilesFromFolder(classImageFolder);

      const trainingData = {
        ...trainingParamsData,
        instancePrompt,
        classPrompt,
        instanceImageList: instanceImageFiles,
        classImageList: classImageListFiles,
        memberId: 1 // 나중에 본인 멤버아이디로 변경
      };

      let trainData = snakecaseKeys(trainingData, { deep: false });
      trainData = cleanObject(trainData);

      const response = await postTraining('remote', trainData);
      console.log('Training started, response:', response);
    } catch (error) {
      console.error('Error during training:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="primary" onClick={handleTrainingStart} loading={loading}>
      Start Training
    </Button>
  );
};

export default TrainingButton;
