import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../../store/store';
import { Input, Checkbox, Button, Modal, Tooltip } from 'antd';

import { MdImageSearch } from 'react-icons/md';
import GenerateButton from '../../common/GenerateButton';

import {
  setPrompt as setTxt2ImgPrompt,
  setNegativePrompt as setTxt2ImgNegativePrompt,
  setIsNegativePrompt as setTxt2ImgIsNegativePrompt
} from '../../../store/slices/generation/txt2ImgSlice';
import {
  setPrompt as setImg2ImgPrompt,
  setNegativePrompt as setImg2ImgNegativePrompt,
  setIsNegativePrompt as setImg2ImgIsNegativePrompt
} from '../../../store/slices/generation/img2ImgSlice';
import {
  setPrompt as setInpaintingPrompt,
  setNegativePrompt as setInpaintingNegativePrompt,
  setIsNegativePrompt as setInpaintingIsNegativePrompt
} from '../../../store/slices/generation/inpaintingSlice';

const { TextArea } = Input;

// 경로에 따른 슬라이스 액션 및 상태 매핑
const sliceActions = {
  '/generation/text-to-image': {
    setPrompt: setTxt2ImgPrompt,
    setNegativePrompt: setTxt2ImgNegativePrompt,
    setIsNegativePrompt: setTxt2ImgIsNegativePrompt,
    selectSlice: (state: RootState) => state.txt2Img
  },
  '/generation/image-to-image': {
    setPrompt: setImg2ImgPrompt,
    setNegativePrompt: setImg2ImgNegativePrompt,
    setIsNegativePrompt: setImg2ImgIsNegativePrompt,
    selectSlice: (state: RootState) => state.img2Img
  },
  '/generation/inpainting': {
    setPrompt: setInpaintingPrompt,
    setNegativePrompt: setInpaintingNegativePrompt,
    setIsNegativePrompt: setInpaintingIsNegativePrompt,
    selectSlice: (state: RootState) => state.inpainting
  }
};

const PromptParams = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  // 경로에 맞는 슬라이스 액션과 상태 선택
  const { setPrompt, setNegativePrompt, setIsNegativePrompt, selectSlice } = sliceActions[currentPath] || {};

  // 슬라이스에서 상태 가져오기
  const { prompt, negativePrompt, isNegativePrompt } = useSelector((state: RootState) => selectSlice(state));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const phrases = prompt ? prompt.split(', ') : [];

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (setPrompt) {
      dispatch(setPrompt(e.target.value));
    }
  };

  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (setNegativePrompt) {
      dispatch(setNegativePrompt(e.target.value));
    }
  };

  const handleNegativePromptToggle = () => {
    if (setIsNegativePrompt) {
      dispatch(setIsNegativePrompt(!isNegativePrompt));
    }
  };

  // 상태 변경 후 체크박스 상태 확인
  useEffect(() => {
    console.log('isNegativePrompt 상태:', isNegativePrompt);
  }, [isNegativePrompt]);

  return (
    <div className="w-full p-6 bg-white rounded-[20px] shadow-md mx-auto border border-gray-300 dark:bg-gray-600 dark:border-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-left text-[#222] dark:text-gray-200">Prompt</p>
        </div>

        <Checkbox
          checked={isNegativePrompt} // 슬라이스에서 가져온 isNegativePrompt 상태 사용
          onChange={handleNegativePromptToggle} // 상태 변경을 위한 핸들러
          className="text-[14px] text-left text-[#464646]"
        >
          Add Negative Prompt
        </Checkbox>
      </div>

      <div className="relative mb-4">
        <TextArea
          rows={4}
          className="pr-10"
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={handlePromptChange}
        />
        {location.pathname !== '/generation/text-to-image' && (
          <Tooltip title="Uploaded image is converted to a text description to assist in prompt creation.">
            <Button
              type="link"
              className="absolute bottom-2 right-2 dark:text-gray-300"
              icon={<MdImageSearch className="text-xl" />}
              onClick={() => setIsModalVisible(true)}
            />
          </Tooltip>
        )}
      </div>

      {isNegativePrompt && (
        <>
          <p className="text-sm text-left text-[#222] mb-2 dark:text-gray-300">Negative Prompt</p>
          <TextArea
            rows={4}
            className="mb-4"
            placeholder="Enter your negative prompt here..."
            value={negativePrompt}
            onChange={handleNegativePromptChange}
          />
        </>
      )}

      <div className="flex justify-end">
        <GenerateButton />
      </div>

      <Modal
        title="Select Inputs"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="flex flex-wrap gap-2">
          {phrases.map((phrase: string, index: number) => (
            <Button
              key={index}
              type={prompt.includes(phrase) ? 'primary' : 'default'}
              onClick={() => dispatch(setPrompt ? setPrompt(phrase) : null)}
            >
              {phrase}
            </Button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default PromptParams;
