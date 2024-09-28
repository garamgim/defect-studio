import { Button } from 'antd';
import { RiSparkling2Fill } from 'react-icons/ri';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const GenerateButton = ({ onClick, disabled }: GenerateButtonProps) => {
  return (
    <Button
      type="primary"
      icon={<RiSparkling2Fill className="mr-2" />}
      shape="round"
      size="large"
      onClick={onClick}
      disabled={disabled}
      className="border-none"
    >
      Generate
    </Button>
  );
};

export default GenerateButton;
