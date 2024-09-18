import { useState } from 'react';
import { Input, Button, Form } from 'antd';
import { showToastSuccess, showToastError } from '../components/common/ToastNotification';
import ToastNotification from '../components/common/ToastNotification';

const Settings = () => {
  const [imagePath, setImagePath] = useState<string>('');
  const [modelPath, setModelPath] = useState<string>('');

  const handleSave = () => {
    // 둘 중 하나만 path입력해도 저장 가능
    if (imagePath.trim() || modelPath.trim()) {
      // => 경로 저장하기 추가
      showToastSuccess(<span>Your paths have been successfully saved.</span>);
    } else {
      showToastError(<span>Please fill in both paths before saving.</span>);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full dark:bg-gray-600 dark:border-none">
        <h1 className="text-[24px] font-semibold mb-6 text-gray-800 dark:text-gray-300">Settings</h1>
        <Form layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Default Path for Generated Images"
            name="imagePath"
            rules={[
              {
                required: false,
                message: 'Please input the path for generated images!'
              }
            ]}
          >
            <Input
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="Enter the path where generated images will be saved"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label="Default Path for Generated Models"
            name="modelPath"
            rules={[
              {
                required: false,
                message: 'Please input the path for generated models!'
              }
            ]}
          >
            <Input
              value={modelPath}
              onChange={(e) => setModelPath(e.target.value)}
              placeholder="Enter the path where generated models will be saved"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="primary" htmlType="submit" className="w-[120px] text-[16px]">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ToastNotification />
    </div>
  );
};

export default Settings;
