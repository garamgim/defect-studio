import { Input, Checkbox, Button, Tooltip, Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { MdImageSearch } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface PromptParamsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  isNegativePrompt: boolean;
  handleNegativePromptChange: (event: CheckboxChangeEvent) => void;
  clipData?: string[];
  handleClipClick?: () => Promise<void>; // 비동기 함수
}

const PromptParams = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  isNegativePrompt,
  handleNegativePromptChange,
  clipData = [],
  handleClipClick
}: PromptParamsProps) => {
  const { TextArea } = Input;
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clipPhrases, setClipPhrases] = useState<string[]>([]);
  const [isClipLoading, setIsClipLoading] = useState(false);

  const level = useSelector((state: RootState) => state.level) as 'Basic' | 'Advanced';

  // clipData가 변경될 때마다 clipPhrases를 업데이트
  useEffect(() => {
    if (clipData && clipData.length > 0) {
      setClipPhrases(clipData.flatMap((data) => data.split(', ')));
    }
  }, [clipData]);

  // Basic일 경우에는 Negative Prompt를 비활성화
  useEffect(() => {
    if (level === 'Basic') {
      setNegativePrompt('');
    }
  }, [level, setNegativePrompt]);

  const handlePromptUpdate = (phrase: string) => {
    const newPrompt = prompt ? `${prompt}, ${phrase}` : phrase;
    setPrompt(newPrompt);
  };

  // 모달이 열릴 때 clipData를 최신 상태로 반영
  const handleIconClick = async () => {
    setIsClipLoading(true);

    // 모달이 열릴 때 최신 clipData로 clipPhrases 초기화
    setClipPhrases(clipData.flatMap((data) => data.split(', ')));
    setIsModalVisible(true);

    if (handleClipClick) {
      await handleClipClick();
      setIsClipLoading(false);
    }
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
            onChange={handleNegativePromptChange}
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
          onChange={(event) => setPrompt(event.target.value)}
        />
        {location.pathname !== '/generation/text-to-image' && handleClipClick && (
          <Tooltip title="Uploaded image is converted to a text description to assist in prompt creation.">
            <Button
              type="link"
              className="absolute bottom-2 right-2 dark:text-gray-300"
              icon={<MdImageSearch className="text-xl" />}
              onClick={handleIconClick}
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
            onChange={(event) => setNegativePrompt(event.target.value)}
          />
        </>
      )}

      {/* generate버튼 위치 */}
      <div className="h-[40px]"></div>

      {/* clip 모달창 */}
      <Modal
        open={isModalVisible}
        footer={null} // 기본 OK/Cancel 버튼 제거
        closable={false} // X 버튼 제거
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="text-[20px] mb-[20px] font-semibold dark:text-gray-300">Prompt Helper</div>
        <div className="flex flex-wrap gap-2">
          {isClipLoading ? (
            <p>Loading...</p>
          ) : clipPhrases.length > 0 ? (
            clipPhrases.map((phrase, index) => (
              <Button
                key={index}
                type={prompt.includes(phrase) ? 'primary' : 'default'}
                onClick={() => handlePromptUpdate(phrase)}
              >
                {phrase}
              </Button>
            ))
          ) : (
            <p>No clip data</p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="primary" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PromptParams;
