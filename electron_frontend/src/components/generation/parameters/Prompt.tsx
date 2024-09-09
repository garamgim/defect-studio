import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom'; 
import { RootState } from '../../../store/store';
import {
  setPrompt,
  setNegativePrompt,
  appendToPrompt,
  resetPromptState,
  setIsNegativePrompt
} from '../../../store/slices/generation/promptSlice';
import { Input, Checkbox, Button, Modal, Tooltip } from 'antd';
import { RiSparkling2Fill } from 'react-icons/ri';
import { MdImageSearch } from 'react-icons/md';

const { TextArea } = Input;

const Prompt = () => {
  const dispatch = useDispatch();
  const { clipData, prompt, negativePrompt, isNegativePrompt } = useSelector((state: RootState) => state.prompt);
  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';
  const location = useLocation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const phrases = clipData.split(', ');

  // 탭 전환 감지 및 상태 리셋
  useEffect(() => {
    // 특정 탭(경로)에 진입할 때 상태를 리셋
    dispatch(resetPromptState());
  }, [location.pathname, dispatch]); // 경로가 변경될 때마다 실행

  const handlePhraseClick = (phrase: string) => {
    dispatch(appendToPrompt(phrase));
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setPrompt(e.target.value));
  };

  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNegativePrompt(e.target.value));
  };

  const handleNegativePromptToggle = () => {
    dispatch(setIsNegativePrompt(!isNegativePrompt));
  };

  return (
    <div className="w-full p-6 bg-white rounded-[20px] shadow-md mx-auto border border-gray-300 dark:bg-gray-600 dark:border-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-left text-[#222] dark:text-gray-200">Prompt</p>
        </div>

        {level === 'Advanced' && (
          <Checkbox
            checked={isNegativePrompt}
            onChange={handleNegativePromptToggle}
            className="text-[14px] text-left text-[#464646]"
          >
            Add Negative Prompt
          </Checkbox>
        )}
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

      {level === 'Advanced' && isNegativePrompt && (
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
        <Button type="primary" icon={<RiSparkling2Fill className="mr-2" />} shape="round" size="large">
          Generate
        </Button>
      </div>

      <Modal title="Select Inputs" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
        <div className="flex flex-wrap gap-2">
          {phrases.map((phrase, index) => (
            <Button
              key={index}
              type={prompt.includes(phrase) ? 'primary' : 'default'}
              onClick={() => handlePhraseClick(phrase)}
            >
              {phrase}
            </Button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Prompt;
