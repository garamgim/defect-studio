import { Button } from 'antd';
import { RiSparkling2Fill } from 'react-icons/ri';

interface GenerateButtonProps {
  onClick: () => void;
}

const GenerateButton = ({ onClick }: GenerateButtonProps) => {
  return (
    <Button type="primary" icon={<RiSparkling2Fill className="mr-2" />} shape="round" size="large" onClick={onClick}>
      Generate
    </Button>
  );
};

export default GenerateButton;
