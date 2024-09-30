import { Tabs, Upload, Input, Button, Checkbox } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { FiFolderPlus } from 'react-icons/fi';
import React from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface UploadImgParamsProps {
  handleImageUpload: (file: File) => void;
  imagePreview: string | null;
  inputPath: string;
  updateInputPath: (inputPath: string) => void;
  outputPath: string;
  updateOutputPath: (outputPath: string) => void;
  updateMode: (mode: 'manual' | 'batch') => void;
  isZipDownload: boolean;
  updateIsZipDownload: (value: boolean) => void;
}

const UploadImgParams = ({
  handleImageUpload,
  imagePreview,
  inputPath,
  outputPath,
  updateInputPath,
  updateOutputPath,
  updateMode,
  isZipDownload,
  updateIsZipDownload
}: UploadImgParamsProps) => {
  const uploadProps = {
    accept: 'image/*',
    beforeUpload: (file: File) => {
      handleImageUpload(file);
      return false;
    },
    showUploadList: false
  };

  const handleSelectInputFolder = async () => {
    try {
      const selectedFolderPath = await window.electron.selectFolder();
      if (selectedFolderPath) {
        updateInputPath(selectedFolderPath); // 인풋 이미지 폴더
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  const handleSelectOutputFolder = async () => {
    try {
      const selectedFolderPath = await window.electron.selectFolder();
      if (selectedFolderPath) {
        updateOutputPath(selectedFolderPath); // 아웃풋 폴더(생성된 이미지 저장할 곳)
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    }
  };

  const onCheckboxChange = (e: CheckboxChangeEvent) => {
    updateIsZipDownload(e.target.checked);
  };

  // 탭 변경될 때
  const handleTabChange = (key: string) => {
    updateMode(key as 'manual' | 'batch');
  };

  const items = [
    {
      key: 'manual',
      label: 'Manual mode',
      children: (
        <div>
          <Upload.Dragger {...uploadProps} className="mb-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded preview" className="w-full h-full object-cover rounded-md" />
            ) : (
              <div>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </div>
            )}
          </Upload.Dragger>
        </div>
      )
    },
    {
      key: 'batch',
      label: 'Batch mode',
      children: (
        <div>
          <div className="mb-4">
            <label htmlFor="imagePath" className="block text-[14px] text-[#222] mb-1 dark:text-gray-300">
              Input directory
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={inputPath || ''}
                onChange={(event) => {
                  updateInputPath(event.target.value);
                }}
                type="text"
                id="imagePath"
                className="w-full"
                placeholder="Enter the image path"
              />
              <Button onClick={handleSelectInputFolder} className="px-[12px]">
                <FiFolderPlus className="w-[18px] h-[18px] text-[#222]" />
              </Button>
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="outputPath" className="block text-[14px] text-[#222] mb-1 dark:text-gray-300">
              Output directory
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={outputPath || ''}
                onChange={(event) => {
                  updateOutputPath(event.target.value);
                }}
                type="text"
                id="outputPath"
                className="w-full"
                placeholder="Enter the output path"
              />
              <Button onClick={handleSelectOutputFolder} className="px-[12px]">
                <FiFolderPlus className="w-[18px] h-[18px] text-[#222]" />
              </Button>
            </div>
            <Checkbox checked={isZipDownload} onChange={onCheckboxChange} className="mt-2">
              Zip
            </Checkbox>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Upload Image</p>
      <Tabs items={items} onChange={handleTabChange} />
    </div>
  );
};

export default React.memo(UploadImgParams);
