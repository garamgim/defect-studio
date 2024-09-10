import { Button } from 'antd';
import { RiSparkling2Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { postTxtToImgGeneration } from '../../api/generation';
import { RootState } from '../../store/store';
import { setImageUrls as setTxtToImgImageUrls } from '../../store/slices/generation/txtToImgSlice';
// import { setImageUrls as setImgToImgImageUrls } from '../../store/slices/generation/imgToImgSlice';
// import { setImageUrls as setInpaintingImageUrls } from '../../store/slices/generation/inSlice';

// 경로에 따른 슬라이스 액션 매핑
const sliceActions = {
  '/generation/text-to-image': {
    generate: postTxtToImgGeneration,
    setImageUrls: setTxtToImgImageUrls,
    selectState: (state: RootState) => state.txtToImg
  },
  // '/generation/image-to-image': {
  //   generate: postImgToImgGeneration,
  //   setImageUrls: setImgToImgImageUrls,
  //   selectState: (state: RootState) => state.imgToImg
  // },
  // '/generation/inpainting': {
  //   generate: postInpaintingGeneration,
  //   setImageUrls: setImgToImgImageUrls,
  //   selectState: (state: RootState) => state.inpainting
  // }
} as const;

const GenerateButton = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname as keyof typeof sliceActions;

  // 필요한 슬라이스 상태만 선택
  const txtToImgState = useSelector((state: RootState) => state.txtToImg);
  const imgToImgState = useSelector((state: RootState) => state.imgToImg);
  const inpaintingState = useSelector((state: RootState) => state.inpainting);

  // 경로에 맞는 슬라이스 액션 가져오기
  const sliceAction = sliceActions[currentPath];

  if (!sliceAction) {
    return null; // 경로에 맞는 액션이 없으면 렌더링하지 않음
  }

  const { generate, setImageUrls } = sliceAction;

  // 경로에 맞는 슬라이스 상태만 가져옴
  const selectedState =
    currentPath === '/generation/text-to-image'
      ? txtToImgState
      : currentPath === '/generation/image-to-image'
        ? imgToImgState
        : inpaintingState;

  const {
    model,
    prompt,
    negativePrompt,
    width,
    height,
    samplingSteps,
    guidanceScale,
    seed,
    batchCount,
    batchSize,
    outputPath
  } = selectedState;

  const handleGenerate = async () => {
    const data = {
      model,
      prompt: prompt || '',
      negative_prompt: negativePrompt || '',
      width,
      height,
      num_inference_steps: samplingSteps,
      guidance_scale: guidanceScale,
      seed,
      batch_count: batchCount,
      batch_size: batchSize,
      output_path: outputPath
    };
    console.log(data);

    try {
      const imageUrls = await generate('remote', data); // API 호출
      console.log('Generated image URLs:', imageUrls);
      dispatch(setImageUrls(imageUrls)); // 이미지 URL을 슬라이스에 저장
      console.log(imageUrls);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <Button
      type="primary"
      icon={<RiSparkling2Fill className="mr-2" />}
      shape="round"
      size="large"
      onClick={handleGenerate}
    >
      Generate
    </Button>
  );
};

export default GenerateButton;
