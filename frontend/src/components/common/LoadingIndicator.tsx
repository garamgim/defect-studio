import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </div>
  );
};

export default LoadingIndicator;
