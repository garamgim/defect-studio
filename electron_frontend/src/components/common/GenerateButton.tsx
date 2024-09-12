import { Button } from 'antd';
import { RiSparkling2Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { postTxt2ImgGeneration, postImg2ImgGeneration, postInpaintingGeneration } from '../../api/generation';
import { RootState } from '../../store/store';
import { setOutputImgUrls as setTxt2ImgoutputImgUrls } from '../../store/slices/generation/txt2ImgSlice';
import { setOutputImgUrls as setImg2ImgoutputImgUrls } from '../../store/slices/generation/img2ImgSlice';
import { convertStringToFile } from '../../utils/convertStringToFile';
import { setOutputImgUrls as setInpaintingoutputImgUrls } from '../../store/slices/generation/inpaintingSlice';

// 경로에 따른 슬라이스 액션 매핑
const sliceActions = {
  '/generation/text-to-image': {
    generate: postTxt2ImgGeneration,
    setOutputImgUrls: setTxt2ImgoutputImgUrls,
    selectState: (state: RootState) => state.txt2Img
  },
  '/generation/image-to-image': {
    generate: postImg2ImgGeneration,
    setOutputImgUrls: setImg2ImgoutputImgUrls,
    selectState: (state: RootState) => state.img2Img
  },
  '/generation/inpainting': {
    generate: postInpaintingGeneration,
    setOutputImgUrls: setImg2ImgoutputImgUrls,
    selectState: (state: RootState) => state.inpainting
  }
} as const;

const GenerateButton = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname as keyof typeof sliceActions;

  // 필요한 슬라이스 상태만 선택
  const txt2ImgState = useSelector((state: RootState) => state.txt2Img);
  const img2ImgState = useSelector((state: RootState) => state.img2Img);
  const inpaintingState = useSelector((state: RootState) => state.inpainting);

  // 경로에 맞는 슬라이스 액션 가져오기
  const sliceAction = sliceActions[currentPath];

  if (!sliceAction) {
    return null; // 경로에 맞는 액션이 없으면 렌더링하지 않음
  }

  const { generate, setOutputImgUrls } = sliceAction;

  // 경로에 맞는 슬라이스 상태만 가져옴
  const selectedState =
    currentPath === '/generation/text-to-image'
      ? txt2ImgState
      : currentPath === '/generation/image-to-image'
        ? img2ImgState
        : inpaintingState;

  const {
    model,
    scheduler,
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
    // 기본 data 구조
    const data: {
      model: string;
      scheduler: string;
      prompt: string;
      negative_prompt: string;
      width: number;
      height: number;
      num_inference_steps: number;
      guidance_scale: number;
      seed: number;
      batch_count: number;
      batch_size: number;
      output_path: string;
    } = {
      model,
      scheduler,
      prompt: prompt || '',
      negative_prompt: negativePrompt || '',
      width,
      height,
      num_inference_steps: samplingSteps,
      guidance_scale: guidanceScale,
      seed,
      batch_count: batchCount,
      batch_size: batchSize,
      output_path: outputPath,
    };

    // image-to-image 경로일 경우에만 strength, images, input_path 추가
    if (currentPath === '/generation/image-to-image') {
      const files = img2ImgState.images.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));

      Object.assign(data, {
        strength: img2ImgState.strength || 0.75,
        images: files || [],
        input_path: img2ImgState.inputPath || ''
      });
    } else if (currentPath === '/generation/inpainting') {
      const files = img2ImgState.images.map((base64Img, index) => convertStringToFile(base64Img, `image_${index}.png`));

      Object.assign(data, {
        strength: img2ImgState.strength || 0.75,
        images: files,
        init_image_list: inpaintingState.initImageList,
        mask_image_list: inpaintingState.maskImageList,
        init_input_path: inpaintingState.initInputPath,
        mask_input_path: inpaintingState.maskInputPath
      });
    }

    try {
      const outputImgUrls = await generate('remote', data);
      console.log('Generated image URLs:', outputImgUrls);
      dispatch(setOutputImgUrls(outputImgUrls));
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
      className="z-10"
    >
      Generate
    </Button>
  );
};

export default GenerateButton;
