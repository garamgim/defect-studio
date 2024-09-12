import { Input, Checkbox, Button, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
// import { MdImageSearch } from 'react-icons/md';
import GenerateButton from '../../common/GenerateButton';

interface PromptParamsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  isNegativePrompt: boolean;
  handleNegativePromptChange: (evnet: CheckboxChangeEvent) => void;
}

const PromptParams = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  isNegativePrompt,
  handleNegativePromptChange
}: PromptParamsProps) => {
  const { TextArea } = Input;

  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const phrases = prompt ? prompt.split(', ') : [];

  return (
    <div className="w-full p-6 bg-white rounded-[20px] shadow-md mx-auto border border-gray-300 dark:bg-gray-600 dark:border-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-left text-[#222] dark:text-gray-200">Prompt</p>
        </div>

        <Checkbox
          checked={isNegativePrompt}
          onChange={handleNegativePromptChange}
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
          onChange={(event) => {
            setPrompt(event.target.value);
          }}
        />
        {/* {location.pathname !== '/generation/text-to-image' && (
          <Tooltip title="Uploaded image is converted to a text description to assist in prompt creation.">
            <Button
              type="link"
              className="absolute bottom-2 right-2 dark:text-gray-300"
              icon={<MdImageSearch className="text-xl" />}
              onClick={() => setIsModalVisible(true)}
            />
          </Tooltip>
        )} */}
      </div>

      {isNegativePrompt && (
        <>
          <p className="text-sm text-left text-[#222] mb-2 dark:text-gray-300">Negative Prompt</p>
          <TextArea
            rows={4}
            className="mb-4"
            placeholder="Enter your negative prompt here..."
            value={negativePrompt}
            onChange={(event) => {
              setNegativePrompt(event.target.value);
            }}
          />
        </>
      )}

      <div className="flex justify-end">
        <GenerateButton />
      </div>

      {/* <Modal
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
              onClick={() => {
                if (setPrompt) {
                  dispatch(setPrompt(phrase));
                }
              }}
            >
              {phrase}
            </Button>
          ))}
        </div>
      </Modal> */}
    </div>
  );
};

export default PromptParams;
